package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime; // SuatChieuId

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat; // GheId

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id")
    private Invoice invoice; // HoaDonId (có thể null nếu vé đang giữ chỗ chưa có hóa đơn, hoặc tùy logic)

    @Column(nullable = false)
    private Double price; // GiaVeThucTe

    @Column(nullable = false)
    private String status; // TrangThai (e.g., BOOKED, RESERVED)
}
