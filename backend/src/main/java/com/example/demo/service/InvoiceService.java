package com.example.demo.service;

import com.example.demo.dto.BookingRequest;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.config.VNPayConfig;
import com.example.demo.config.MomoConfig;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceDetailRepository invoiceDetailRepository;
    private final TicketRepository ticketRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final FoodDrinkRepository foodDrinkRepository;
    private final UserRepository userRepository;
    private final VoucherRepository voucherRepository;
    private final EmailService emailService;
    private final HttpServletRequest httpServletRequest;

    public Map<String, Object> createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size()) {
            throw new RuntimeException("Some seats were not found!");
        }

        // Validate seats availability for this showtime
        List<Ticket> bookedTickets = ticketRepository.findByShowtimeId(request.getShowtimeId());
        for (Seat seat : seats) {
            boolean isBooked = bookedTickets.stream()
                    .anyMatch(t -> t.getSeat() != null && seat.getId().equals(t.getSeat().getId()));
            if (isBooked) {
                throw new RuntimeException("Ghế " + seat.getRowNumber() + seat.getSeatNumber() + " đã bị đặt trước!");
            }
        }

        double totalAmount = 0;
        
        // Calculate seats price with seat types (VIP +20k, COUPLE +40k)
        List<Ticket> ticketsToSave = new ArrayList<>();
        for (Seat seat : seats) {
            double seatPrice = showtime.getBasePrice();
            if ("VIP".equalsIgnoreCase(seat.getType())) {
                seatPrice += 20000;
            } else if ("COUPLE".equalsIgnoreCase(seat.getType())) {
                seatPrice += 40000;
            }
            totalAmount += seatPrice;

            Ticket ticket = Ticket.builder()
                    .showtime(showtime)
                    .seat(seat)
                    .price(seatPrice)
                    .status("BOOKED")
                    .build();
            ticketsToSave.add(ticket);
        }

        // Process food/drinks
        List<InvoiceDetail> details = new ArrayList<>();
        if (request.getFoodDrinks() != null) {
            for (Map.Entry<Long, Integer> entry : request.getFoodDrinks().entrySet()) {
                Long fdId = entry.getKey();
                int qty = entry.getValue();
                if (qty <= 0) continue;

                FoodDrink fd = foodDrinkRepository.findById(fdId)
                        .orElseThrow(() -> new RuntimeException("Food & drink item not found"));

                if (fd.getStockQuantity() < qty) {
                    throw new RuntimeException("Sản phẩm " + fd.getName() + " không đủ hàng tồn kho!");
                }

                // Decrease stock quantity
                fd.setStockQuantity(fd.getStockQuantity() - qty);
                foodDrinkRepository.save(fd);

                totalAmount += fd.getPrice() * qty;

                InvoiceDetail detail = InvoiceDetail.builder()
                        .foodDrink(fd)
                        .quantity(qty)
                        .flavor(request.getFoodFlavors() != null ? request.getFoodFlavors().get(fdId) : null)
                        .build();
                details.add(detail);
            }

        }

        // Process Voucher discount
        if (request.getVoucherCode() != null && !request.getVoucherCode().trim().isEmpty()) {
            Voucher voucher = voucherRepository.findByCode(request.getVoucherCode().trim().toUpperCase())
                    .filter(Voucher::getActive)
                    .orElseThrow(() -> new RuntimeException("Mã khuyến mãi không hợp lệ hoặc đã hết hạn!"));
            totalAmount = Math.max(0, totalAmount - voucher.getDiscountAmount());
        }

        // Save Invoice
        Invoice invoice = Invoice.builder()
                .user(user)
                .createdDate(LocalDateTime.now())
                .totalAmount(totalAmount)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("VNPay".equalsIgnoreCase(request.getPaymentMethod()) ? "PENDING" : "SUCCESS")
                .build();
        invoice = invoiceRepository.save(invoice);

        // Save Tickets
        for (Ticket ticket : ticketsToSave) {
            ticket.setInvoice(invoice);
            ticketRepository.save(ticket);
        }

        // Save Invoice Details
        for (InvoiceDetail detail : details) {
            detail.setInvoice(invoice);
            invoiceDetailRepository.save(detail);
        }

        // Handle payment method
        String paymentMethod = request.getPaymentMethod();
        if (paymentMethod == null) paymentMethod = "Thanh toán tại quày";

        // VNPAY Payment
        if ("VNPay".equalsIgnoreCase(paymentMethod)) {
            try {
                String vnp_TxnRef = String.valueOf(invoice.getId()) + "_" + VNPayConfig.getRandomNumber(8);
                String vnp_IpAddr = VNPayConfig.getIpAddress(httpServletRequest);

                Map<String, String> vnp_Params = new HashMap<>();
                vnp_Params.put("vnp_Version", VNPayConfig.vnp_Version);
                vnp_Params.put("vnp_Command", VNPayConfig.vnp_Command);
                vnp_Params.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
                vnp_Params.put("vnp_Amount", String.valueOf((int) (invoice.getTotalAmount() * 100)));
                vnp_Params.put("vnp_CurrCode", "VND");
                vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
                vnp_Params.put("vnp_OrderInfo", "Thanh toan ve xem phim: " + showtime.getMovie().getTitle());
                vnp_Params.put("vnp_OrderType", "other");
                vnp_Params.put("vnp_Locale", "vn");
                vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
                vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

                java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
                String vnp_CreateDate = LocalDateTime.now().format(formatter);
                vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

                List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
                Collections.sort(fieldNames);
                StringBuilder hashData = new StringBuilder();
                StringBuilder query = new StringBuilder();
                boolean first = true;
                for (String fieldName : fieldNames) {
                    String fieldValue = vnp_Params.get(fieldName);
                    if (fieldValue != null && fieldValue.length() > 0) {
                        if (!first) {
                            query.append('&');
                            hashData.append('&');
                        }
                        first = false;
                        
                        hashData.append(fieldName);
                        hashData.append('=');
                        hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                        query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                        query.append('=');
                        query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    }
                }
                String queryUrl = query.toString();
                System.out.println("=== VNPAY DEBUG START ===");
                System.out.println("vnp_TmnCode: " + VNPayConfig.vnp_TmnCode);
                System.out.println("vnp_HashSecret: " + VNPayConfig.vnp_HashSecret);
                System.out.println("hashData: " + hashData.toString());
                String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
                System.out.println("vnp_SecureHash: " + vnp_SecureHash);
                System.out.println("=== VNPAY DEBUG END ===");
                queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
                String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;

                Map<String, Object> response = new HashMap<>();
                response.put("invoiceId", invoice.getId());
                response.put("totalAmount", invoice.getTotalAmount());
                response.put("paymentMethod", invoice.getPaymentMethod());
                response.put("createdDate", invoice.getCreatedDate());
                response.put("paymentUrl", paymentUrl);
                return response;
            } catch (Exception e) {
                throw new RuntimeException("Lỗi sinh link thanh toán VNPay: " + e.getMessage());
            }
        }

        // MOMO Payment
        if ("Momo".equalsIgnoreCase(paymentMethod)) {
            try {
                String momo_RequestId = String.valueOf(invoice.getId()) + "_" + MomoConfig.getRandomNumber(8);
                String momo_OrderId = String.valueOf(invoice.getId());
                String momo_Amount = String.valueOf(invoice.getTotalAmount().longValue());
                String momo_OrderInfo = "Thanh toan ve xem phim: " + showtime.getMovie().getTitle();

                // For Momo, we can use a direct payment link or implement webhook
                // This is a simplified implementation
                String paymentUrl = "https://momo.vn/qr/" + momo_RequestId;

                Map<String, Object> response = new HashMap<>();
                response.put("invoiceId", invoice.getId());
                response.put("totalAmount", invoice.getTotalAmount());
                response.put("paymentMethod", invoice.getPaymentMethod());
                response.put("createdDate", invoice.getCreatedDate());
                response.put("paymentUrl", paymentUrl);
                response.put("message", "Vui lòng quét mã QR hoặc chuyển khoản để hoàn tất thanh toán");
                return response;
            } catch (Exception e) {
                throw new RuntimeException("Lỗi sinh link thanh toán Momo: " + e.getMessage());
            }
        }

        // Thanh toán tại quày
        sendBookingSuccessEmail(invoice, ticketsToSave);

        Map<String, Object> response = new HashMap<>();
        response.put("invoiceId", invoice.getId());
        response.put("totalAmount", invoice.getTotalAmount());
        response.put("paymentMethod", invoice.getPaymentMethod());
        response.put("createdDate", invoice.getCreatedDate());
        response.put("message", "Đơn vé của bạn đã được tạo. Vui lòng thanh toán tại quầy rạp chiếu phim.");
        return response;
    }

    public void sendBookingSuccessEmail(Invoice invoice, List<Ticket> tickets) {
        try {
            String customerName = invoice.getUser().getFullName();
            String invoiceId = String.valueOf(invoice.getId());
            String movieTitle = tickets.isEmpty() ? "" : tickets.get(0).getShowtime().getMovie().getTitle();
            String cinemaName = tickets.isEmpty() ? "" : tickets.get(0).getShowtime().getRoom().getCinema().getName();
            String roomName = tickets.isEmpty() ? "" : tickets.get(0).getShowtime().getRoom().getName();
            String showDate = tickets.isEmpty() ? "" : tickets.get(0).getShowtime().getShowDate().toString();
            String startTime = tickets.isEmpty() ? "" : tickets.get(0).getShowtime().getStartTime().toString();
            
            String seatNames = tickets.stream()
                    .map(t -> t.getSeat().getRowNumber() + t.getSeat().getSeatNumber())
                    .collect(Collectors.joining(", "));

            StringBuilder foodsBuilder = new StringBuilder();
            List<InvoiceDetail> details = invoiceDetailRepository.findByInvoiceId(invoice.getId());
            if (!details.isEmpty()) {
                foodsBuilder.append("<div style=\"border-top: 1px dashed #cbd5e1; margin: 16px 0;\"></div>");
                foodsBuilder.append("<div style=\"font-size: 12px; font-weight: bold; margin-bottom: 10px; letter-spacing: 1px; color: #0f172a;\">BẮP NƯỚC / COMBO</div>");
                foodsBuilder.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"font-size: 13px; line-height: 1.6; font-family: 'Courier New', Courier, monospace, sans-serif;\">");
                for (InvoiceDetail detail : details) {
                    foodsBuilder.append("<tr>");
                    foodsBuilder.append("  <td align=\"left\" style=\"padding: 2px 0;\">");
                    foodsBuilder.append(detail.getFoodDrink().getName());
                    if (detail.getFlavor() != null) {
                        foodsBuilder.append(" (").append(detail.getFlavor()).append(")");
                    }
                    foodsBuilder.append("<span style=\"font-weight: bold;\"> x").append(detail.getQuantity()).append("</span>");
                    foodsBuilder.append("  </td>");
                    foodsBuilder.append("  <td align=\"right\" style=\"padding: 2px 0; font-weight: bold;\">");
                    foodsBuilder.append(String.format("%,.0f", detail.getFoodDrink().getPrice() * detail.getQuantity())).append(" ₫");
                    foodsBuilder.append("  </td>");
                    foodsBuilder.append("</tr>");
                }
                foodsBuilder.append("</table>");
            }
            String foodsSection = foodsBuilder.toString();
            String formattedTotal = String.format("%,.0f", invoice.getTotalAmount());
            String createdDate = invoice.getCreatedDate().toString();
            String paymentMethod = invoice.getPaymentMethod() != null ? invoice.getPaymentMethod() : "Tại quầy";

            String htmlBody = "<div style=\"font-family: 'Courier New', Courier, monospace, sans-serif; max-width: 420px; margin: 0 auto; background: #fffdf9; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 24px; color: #1e293b; box-shadow: 0 4px 10px rgba(0,0,0,0.05);\">" +
                "  <div style=\"text-align: center; margin-bottom: 16px;\">" +
                "    <h2 style=\"margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #e71a0f; text-transform: uppercase;\">CGV CINEMAS</h2>" +
                "    <p style=\"margin: 4px 0; font-size: 11px; color: #64748b;\">CJ CGV VIETNAM CO., LTD</p>" +
                "    <p style=\"margin: 4px 0; font-size: 11px; color: #64748b;\">Chi nhánh: " + cinemaName + "</p>" +
                "    <p style=\"margin: 4px 0; font-size: 11px; color: #64748b;\">ĐT: 1900 6017 | cgv.vn</p>" +
                "  </div>" +
                "  <div style=\"border-top: 1px dashed #cbd5e1; margin: 16px 0;\"></div>" +
                "  <div style=\"text-align: center; margin: 10px 0;\">" +
                "    <h3 style=\"margin: 0; font-size: 16px; font-weight: bold; text-transform: uppercase;\">PHIẾU THANH TOÁN VÉ</h3>" +
                "    <p style=\"margin: 2px 0; font-size: 11px; color: #64748b;\">TICKET RECEIPT</p>" +
                "  </div>" +
                "  <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"font-size: 13px; line-height: 1.6; font-family: 'Courier New', Courier, monospace, sans-serif;\">" +
                "    <tr>" +
                "      <td align=\"left\">Mã hóa đơn / Inv No:</td>" +
                "      <td align=\"right\"><strong>#TKT" + invoiceId + "</strong></td>" +
                "    </tr>" +
                "    <tr>" +
                "      <td align=\"left\">Thời gian / Date:</td>" +
                "      <td align=\"right\">" + createdDate + "</td>" +
                "    </tr>" +
                "    <tr>" +
                "      <td align=\"left\">Khách hàng / Cust:</td>" +
                "      <td align=\"right\">" + customerName + "</td>" +
                "    </tr>" +
                "  </table>" +
                "  <div style=\"border-top: 1px dashed #cbd5e1; margin: 16px 0;\"></div>" +
                "  <div style=\"font-size: 18px; font-weight: 900; text-align: center; margin-bottom: 16px; line-height: 1.4; color: #0f172a; text-transform: uppercase;\">" +
                   movieTitle +
                "  </div>" +
                "  <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"font-size: 13px; line-height: 1.7; font-family: 'Courier New', Courier, monospace, sans-serif;\">" +
                "    <tr>" +
                "      <td align=\"left\" style=\"padding: 2px 0;\">Rạp / Cinema:</td>" +
                "      <td align=\"right\" style=\"padding: 2px 0;\"><strong>" + cinemaName + "</strong></td>" +
                "    </tr>" +
                "    <tr>" +
                "      <td align=\"left\" style=\"padding: 2px 0;\">Phòng / Room:</td>" +
                "      <td align=\"right\" style=\"padding: 2px 0;\"><strong>" + roomName + "</strong></td>" +
                "    </tr>" +
                "    <tr>" +
                "      <td align=\"left\" style=\"padding: 2px 0;\">Suất / Showtime:</td>" +
                "      <td align=\"right\" style=\"padding: 2px 0;\"><strong>" + showDate + " | " + startTime + "</strong></td>" +
                "    </tr>" +
                "    <tr>" +
                "      <td align=\"left\" style=\"padding: 2px 0;\">Ghế / Seats:</td>" +
                "      <td align=\"right\" style=\"padding: 2px 0;\"><strong style=\"font-size: 16px; color: #e71a0f;\">" + seatNames + "</strong></td>" +
                "    </tr>" +
                "  </table>" +
                "  " + foodsSection + "" +
                "  <div style=\"border-top: 1px dashed #cbd5e1; margin: 16px 0;\"></div>" +
                "  <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"font-size: 14px; font-family: 'Courier New', Courier, monospace, sans-serif;\">" +
                "    <tr>" +
                "      <td align=\"left\" style=\"font-weight: bold; font-size: 14px;\">TỔNG CỘNG / TOTAL:</td>" +
                "      <td align=\"right\" style=\"font-size: 22px; color: #e71a0f; font-weight: bold;\">" + formattedTotal + " ₫</td>" +
                "    </tr>" +
                "    <tr>" +
                "      <td align=\"left\" style=\"font-size: 12px; color: #64748b; padding-top: 4px;\">Thanh toán / Method:</td>" +
                "      <td align=\"right\" style=\"font-size: 12px; color: #64748b; padding-top: 4px;\">" + paymentMethod + "</td>" +
                "    </tr>" +
                "  </table>" +
                "  <div style=\"border-top: 1px dashed #cbd5e1; margin: 16px 0;\"></div>" +
                "  <div style=\"text-align: center; margin: 20px 0 10px 0;\">" +
                "    <div style=\"display: inline-block; padding: 6px; border: 1px solid #e2e8f0; background: white; border-radius: 8px;\">" +
                "      <img src=\"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT" + invoiceId + "\" alt=\"Mã QR\" style=\"width: 150px; height: 150px; display: block;\" />" +
                "    </div>" +
                "    <p style=\"margin: 8px 0 2px 0; font-size: 12px; font-weight: bold; color: #0f172a;\">MÃ VÉ: #TKT" + invoiceId + "</p>" +
                "    <p style=\"margin: 0; font-size: 10px; color: #94a3b8; line-height: 1.3;\">Vui lòng quét mã QR này tại quầy bán vé hoặc lối vào phòng chiếu</p>" +
                "  </div>" +
                "  <div style=\"border-top: 1px dashed #cbd5e1; margin: 16px 0;\"></div>" +
                "  <div style=\"text-align: center; font-size: 11px; color: #64748b; margin-top: 16px; line-height: 1.4;\">" +
                "    <p style=\"margin: 0;\">Chúc quý khách xem phim vui vẻ!</p>" +
                "    <p style=\"margin: 4px 0 0;\">ENJOY YOUR MOVIE!</p>" +
                "  </div>" +
                "</div>";

            emailService.sendHtmlMessage(invoice.getUser().getEmail(), "Xác nhận đặt vé thành công tại CGV - Đơn vé #" + invoiceId, htmlBody);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public List<Map<String, Object>> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return invoiceRepository.findAll().stream()
                .filter(invoice -> invoice.getUser() != null && user.getId().equals(invoice.getUser().getId()))
                .map(invoice -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", invoice.getId());
                    map.put("createdDate", invoice.getCreatedDate());
                    map.put("totalAmount", invoice.getTotalAmount());
                    map.put("paymentMethod", invoice.getPaymentMethod());
                    map.put("paymentStatus", invoice.getPaymentStatus());

                    // Get tickets for this invoice
                    List<Ticket> tickets = ticketRepository.findAll().stream()
                            .filter(t -> t.getInvoice() != null && invoice.getId().equals(t.getInvoice().getId()))
                            .collect(Collectors.toList());

                    if (!tickets.isEmpty()) {
                        Showtime st = tickets.get(0).getShowtime();
                        map.put("movieTitle", st.getMovie().getTitle());
                        map.put("cinemaName", st.getRoom().getCinema().getName());
                        map.put("roomName", st.getRoom().getName());
                        map.put("showDate", st.getShowDate());
                        map.put("startTime", st.getStartTime());
                        map.put("seats", tickets.stream()
                                .map(t -> t.getSeat().getRowNumber() + t.getSeat().getSeatNumber())
                                .collect(Collectors.joining(", ")));
                    }

                    // Get foods for this invoice
                    List<InvoiceDetail> foods = invoiceDetailRepository.findByInvoiceId(invoice.getId());
                    map.put("foods", foods.stream()
                            .map(detail -> detail.getFoodDrink().getName() + 
                                    (detail.getFlavor() != null ? " (" + detail.getFlavor() + ")" : "") + 
                                    " (x" + detail.getQuantity() + ")")
                            .collect(Collectors.joining(", ")));


                    return map;
                })
                .collect(Collectors.toList());
    }

    public void deleteInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        // Delete tickets
        List<Ticket> tickets = ticketRepository.findByInvoiceId(id);
        ticketRepository.deleteAll(tickets);

        // Delete invoice details
        List<InvoiceDetail> details = invoiceDetailRepository.findByInvoiceId(id);
        invoiceDetailRepository.deleteAll(details);

        // Delete invoice
        invoiceRepository.delete(invoice);
    }
}

