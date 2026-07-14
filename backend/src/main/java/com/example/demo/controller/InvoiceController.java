package com.example.demo.controller;

import com.example.demo.dto.BookingRequest;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.repository.TicketRepository;
import com.example.demo.repository.InvoiceDetailRepository;
import com.example.demo.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Collections;
import java.util.Iterator;
import java.util.ArrayList;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceDetailRepository invoiceDetailRepository;
    private final TicketRepository ticketRepository;
    private final InvoiceService invoiceService;

    @org.springframework.beans.factory.annotation.Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllInvoices() {
        List<Map<String, Object>> result = invoiceRepository.findAll().stream().map(invoice -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", invoice.getId());
            map.put("customerName", invoice.getUser() != null ? invoice.getUser().getFullName() : "Khách");
            map.put("customerEmail", invoice.getUser() != null ? invoice.getUser().getEmail() : "");
            map.put("createdDate", invoice.getCreatedDate());
            map.put("totalAmount", invoice.getTotalAmount());
            map.put("paymentMethod", invoice.getPaymentMethod() != null ? invoice.getPaymentMethod() : "Chưa chọn");
            map.put("paymentStatus", invoice.getPaymentStatus() != null ? invoice.getPaymentStatus() : "SUCCESS");
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMyBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(invoiceService.getMyBookings(email));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody BookingRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Map<String, Object> result = invoiceService.createBooking(request, email);
        return ResponseEntity.status(
            result.containsKey("paymentUrl") ? 200 : 200
        ).body(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getInvoiceById(@PathVariable("id") Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isStaffOrAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_STAFF"));

        return invoiceRepository.findById(id).map(invoice -> {
            if (!isStaffOrAdmin && (invoice.getUser() == null || !email.equals(invoice.getUser().getEmail()))) {
                return ResponseEntity.status(403).<Map<String, Object>>build();
            }
            Map<String, Object> result = new java.util.HashMap<>();

            result.put("id", invoice.getId());
            result.put("customerName", invoice.getUser() != null ? invoice.getUser().getFullName() : "Khách");
            result.put("customerEmail", invoice.getUser() != null ? invoice.getUser().getEmail() : "");
            result.put("createdDate", invoice.getCreatedDate());
            result.put("totalAmount", invoice.getTotalAmount());
            result.put("paymentMethod", invoice.getPaymentMethod() != null ? invoice.getPaymentMethod() : "Chưa chọn");
            result.put("paymentStatus", invoice.getPaymentStatus() != null ? invoice.getPaymentStatus() : "SUCCESS");
            
            // Get real tickets for this invoice
            List<Map<String, Object>> tickets = ticketRepository.findAll().stream()
                .filter(t -> t.getInvoice() != null && invoice.getId().equals(t.getInvoice().getId()))
                .map(t -> {
                    Map<String, Object> ticketMap = new java.util.HashMap<>();
                    ticketMap.put("movieTitle", t.getShowtime() != null && t.getShowtime().getMovie() != null ? t.getShowtime().getMovie().getTitle() : "Phim");
                    ticketMap.put("cinemaName", t.getShowtime() != null && t.getShowtime().getRoom() != null && t.getShowtime().getRoom().getCinema() != null ? t.getShowtime().getRoom().getCinema().getName() : "Rạp");
                    ticketMap.put("roomName", t.getShowtime() != null && t.getShowtime().getRoom() != null ? t.getShowtime().getRoom().getName() : "Phòng");
                    ticketMap.put("showTime", t.getShowtime() != null ? t.getShowtime().getShowDate() + " " + t.getShowtime().getStartTime() : "Giờ");
                    ticketMap.put("seatName", t.getSeat() != null ? t.getSeat().getRowNumber() + t.getSeat().getSeatNumber() : "Ghế");
                    ticketMap.put("showtimeId", t.getShowtime() != null ? t.getShowtime().getId() : null);
                    ticketMap.put("price", t.getPrice() != null ? t.getPrice() : 0.0);
                    return ticketMap;
                })
                .collect(Collectors.toList());
            result.put("tickets", tickets);

            // Get real foods for this invoice
            List<Map<String, Object>> foods = invoiceDetailRepository.findByInvoiceId(invoice.getId()).stream()
                .map(detail -> {
                    Map<String, Object> foodMap = new java.util.HashMap<>();
                    foodMap.put("name", detail.getFoodDrink() != null ? detail.getFoodDrink().getName() : "Combo");
                    foodMap.put("quantity", detail.getQuantity() != null ? detail.getQuantity() : 0);
                    foodMap.put("price", detail.getFoodDrink() != null && detail.getFoodDrink().getPrice() != null ? detail.getFoodDrink().getPrice() : 0.0);
                    foodMap.put("flavor", detail.getFlavor());
                    return foodMap;

                })
                .collect(Collectors.toList());
            result.put("foods", foods);
            
            return ResponseEntity.ok(result);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/check-payment-status/{invoiceId}")
    public ResponseEntity<Map<String, Object>> checkPaymentStatus(@PathVariable("invoiceId") Long invoiceId) {
        return invoiceRepository.findById(invoiceId).map(invoice -> {
            Map<String, Object> result = new java.util.HashMap<>();
            result.put("id", invoice.getId());
            result.put("paymentStatus", invoice.getPaymentStatus());
            result.put("paymentMethod", invoice.getPaymentMethod());
            result.put("totalAmount", invoice.getTotalAmount());
            result.put("createdDate", invoice.getCreatedDate());
            return ResponseEntity.ok(result);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/vnpay-callback")
    public void vnpayCallback(
            @RequestParam Map<String, String> queryParams,
            jakarta.servlet.http.HttpServletResponse response) throws java.io.IOException {
        
        String vnp_SecureHash = queryParams.get("vnp_SecureHash");
        String vnp_TxnRef = queryParams.get("vnp_TxnRef");
        String vnp_ResponseCode = queryParams.get("vnp_ResponseCode");

        // Remove SecureHash parameter for hashing verification
        Map<String, String> hashParams = new java.util.HashMap<>(queryParams);
        hashParams.remove("vnp_SecureHash");
        hashParams.remove("vnp_SecureHashType");

        // Sort keys
        List<String> fieldNames = new ArrayList<>(hashParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        boolean first = true;
        for (String fieldName : fieldNames) {
            if (!fieldName.startsWith("vnp_")) {
                continue;
            }
            String fieldValue = hashParams.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                if (!first) {
                    hashData.append('&');
                }
                first = false;
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(java.net.URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
            }
        }

        String calculatedHash = com.example.demo.config.VNPayConfig.hmacSHA512(com.example.demo.config.VNPayConfig.vnp_HashSecret, hashData.toString());

        String invoiceIdStr = "";
        
        if (calculatedHash.equalsIgnoreCase(vnp_SecureHash)) {
            if (vnp_TxnRef != null) {
                invoiceIdStr = vnp_TxnRef.split("_")[0];
                Long invoiceId = Long.parseLong(invoiceIdStr);
                
                Optional<com.example.demo.entity.Invoice> optInvoice = invoiceRepository.findById(invoiceId);
                if (optInvoice.isPresent()) {
                    com.example.demo.entity.Invoice invoice = optInvoice.get();
                    if ("00".equals(vnp_ResponseCode)) {
                        invoice.setPaymentStatus("SUCCESS");
                        invoiceRepository.save(invoice);
                        
                        // Fetch tickets to send email
                        List<com.example.demo.entity.Ticket> tickets = ticketRepository.findAll().stream()
                                .filter(t -> t.getInvoice() != null && invoice.getId().equals(t.getInvoice().getId()))
                                .collect(Collectors.toList());
                        invoiceService.sendBookingSuccessEmail(invoice, tickets);
                    } else {
                        invoice.setPaymentStatus("FAILED");
                        invoiceRepository.save(invoice);
                    }
                }
            }
        }
        
        // Redirect to frontend with invoice ID and status
        response.sendRedirect(frontendUrl + "/payment-result?invoiceId=" + invoiceIdStr + "&method=vnpay");
    }

    @GetMapping("/vnpay-ipn")
    public ResponseEntity<Map<String, String>> vnpayIpn(@RequestParam Map<String, String> queryParams) {
        String vnp_SecureHash = queryParams.get("vnp_SecureHash");
        String vnp_TxnRef = queryParams.get("vnp_TxnRef");
        String vnp_ResponseCode = queryParams.get("vnp_ResponseCode");

        // Remove SecureHash parameter for hashing verification
        Map<String, String> hashParams = new java.util.HashMap<>(queryParams);
        hashParams.remove("vnp_SecureHash");
        hashParams.remove("vnp_SecureHashType");

        // Sort keys
        List<String> fieldNames = new ArrayList<>(hashParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        boolean first = true;
        for (String fieldName : fieldNames) {
            if (!fieldName.startsWith("vnp_")) {
                continue;
            }
            String fieldValue = hashParams.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                if (!first) {
                    hashData.append('&');
                }
                first = false;
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(java.net.URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (Exception e) {
                    hashData.append(fieldValue);
                }
            }
        }

        String calculatedHash = com.example.demo.config.VNPayConfig.hmacSHA512(com.example.demo.config.VNPayConfig.vnp_HashSecret, hashData.toString());
        
        Map<String, String> response = new java.util.HashMap<>();

        if (!calculatedHash.equalsIgnoreCase(vnp_SecureHash)) {
            response.put("RspCode", "97");
            response.put("Message", "Invalid signature");
            return ResponseEntity.ok(response);
        }

        if (vnp_TxnRef != null && !vnp_TxnRef.isEmpty()) {
            try {
                String invoiceIdStr = vnp_TxnRef.split("_")[0];
                Long invoiceId = Long.parseLong(invoiceIdStr);
                
                Optional<com.example.demo.entity.Invoice> optInvoice = invoiceRepository.findById(invoiceId);
                if (optInvoice.isPresent()) {
                    com.example.demo.entity.Invoice invoice = optInvoice.get();
                    if ("00".equals(vnp_ResponseCode)) {
                        if (!"SUCCESS".equals(invoice.getPaymentStatus())) {
                            invoice.setPaymentStatus("SUCCESS");
                            invoiceRepository.save(invoice);
                            
                            // Send confirmation email
                            List<com.example.demo.entity.Ticket> tickets = ticketRepository.findAll().stream()
                                    .filter(t -> t.getInvoice() != null && invoice.getId().equals(t.getInvoice().getId()))
                                    .collect(Collectors.toList());
                            invoiceService.sendBookingSuccessEmail(invoice, tickets);
                        }
                        response.put("RspCode", "00");
                        response.put("Message", "Confirm success");
                    } else {
                        invoice.setPaymentStatus("FAILED");
                        invoiceRepository.save(invoice);
                        response.put("RspCode", "00");
                        response.put("Message", "Confirm fail");
                    }
                } else {
                    response.put("RspCode", "01");
                    response.put("Message", "Order not found");
                }
            } catch (Exception e) {
                response.put("RspCode", "99");
                response.put("Message", "Unknown error: " + e.getMessage());
            }
        } else {
            response.put("RspCode", "01");
            response.put("Message", "Missing TxnRef");
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/momo-callback")
    public void momoCallback(
            @RequestParam Map<String, String> queryParams,
            jakarta.servlet.http.HttpServletResponse response) throws java.io.IOException {
        
        String orderId = queryParams.get("orderId");
        String resultCode = queryParams.get("resultCode");
        String message = queryParams.get("message");

        String status = "fail";
        String invoiceIdStr = "";
        
        try {
            if (orderId != null && !orderId.isEmpty()) {
                invoiceIdStr = orderId.split("_")[0];
                Long invoiceId = Long.parseLong(invoiceIdStr);
                
                Optional<com.example.demo.entity.Invoice> optInvoice = invoiceRepository.findById(invoiceId);
                if (optInvoice.isPresent()) {
                    com.example.demo.entity.Invoice invoice = optInvoice.get();
                    // Momo uses resultCode 0 for success
                    if ("0".equals(resultCode)) {
                        invoice.setPaymentStatus("SUCCESS");
                        invoiceRepository.save(invoice);
                        
                        // Fetch tickets to send email
                        List<com.example.demo.entity.Ticket> tickets = ticketRepository.findAll().stream()
                                .filter(t -> t.getInvoice() != null && invoice.getId().equals(t.getInvoice().getId()))
                                .collect(Collectors.toList());
                        invoiceService.sendBookingSuccessEmail(invoice, tickets);
                        
                        status = "success";
                    } else {
                        invoice.setPaymentStatus("FAILED");
                        invoiceRepository.save(invoice);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error processing Momo callback: " + e.getMessage());
        }
        
        response.sendRedirect(frontendUrl + "/?momo_status=" + status + "&invoiceId=" + invoiceIdStr);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable("id") Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}



