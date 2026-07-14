package com.example.demo.controller;

import com.example.demo.entity.Invoice;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.TicketRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final InvoiceRepository invoiceRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        List<Invoice> allInvoices = invoiceRepository.findAll();
        
        double totalRevenue = allInvoices.stream()
                .filter(i -> i.getPaymentStatus() != null && "SUCCESS".equalsIgnoreCase(i.getPaymentStatus().trim()))
                .mapToDouble(Invoice::getTotalAmount)
                .sum();

        long activeMovies = movieRepository.findAll().stream()
                .filter(m -> {
                    String status = m.getStatus();
                    if (status == null) return false;
                    String x = status.toUpperCase();
                    return x.contains("DANG") || x.contains("ĐANG") || x.contains("DANG_CHIEU") || x.contains("DANG-CHIEU");
                })
                .count();

        long totalUsers = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && "CUSTOMER".equalsIgnoreCase(u.getRole().trim()))
                .count();
        
        // Đếm vé đã bán (vé trong hóa đơn có trạng thái thanh toán thành công)
        long totalTickets = allInvoices.stream()
                .filter(i -> i.getPaymentStatus() != null && "SUCCESS".equalsIgnoreCase(i.getPaymentStatus().trim()))
                .flatMap(i -> ticketRepository.findByInvoiceId(i.getId()).stream())
                .count();

        LocalDate today = LocalDate.now();
        List<Map<String, Object>> revenueChart = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            double revenueForDay = allInvoices.stream()
                    .filter(inv -> inv.getPaymentStatus() != null && "SUCCESS".equalsIgnoreCase(inv.getPaymentStatus().trim()) && inv.getCreatedDate() != null && inv.getCreatedDate().toLocalDate().equals(date))
                    .mapToDouble(Invoice::getTotalAmount)
                    .sum();
            
            Map<String, Object> dayMap = new java.util.HashMap<>();
            dayMap.put("name", date.format(formatter));
            dayMap.put("revenue", revenueForDay);
            revenueChart.add(dayMap);
        }

        List<Object[]> topMovieData = ticketRepository.getTopMovies();
        List<Map<String, Object>> topMovies = new ArrayList<>();
        for (Object[] row : topMovieData) {
            Map<String, Object> topMovieMap = new java.util.HashMap<>();
            topMovieMap.put("id", row[0]);
            topMovieMap.put("title", row[1] != null ? row[1] : "Không rõ");
            topMovieMap.put("tickets", row[2] != null ? row[2] : 0);
            
            double rev = 0.0;
            if (row[3] != null) {
                if (row[3] instanceof Number) {
                    rev = ((Number) row[3]).doubleValue();
                }
            }
            topMovieMap.put("revenue", String.format("%,.0f đ", rev));
            topMovies.add(topMovieMap);
        }

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("totalRevenue", totalRevenue);
        response.put("activeMovies", activeMovies);
        response.put("totalUsers", totalUsers);
        response.put("totalTickets", totalTickets);
        response.put("revenueChart", revenueChart);
        response.put("topMovies", topMovies);

        return ResponseEntity.ok(response);
    }
}
