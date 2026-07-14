package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // NguoiDungId

    @Column(nullable = false)
    private LocalDateTime createdDate; // NgayLap

    @Column(nullable = false)
    private Double totalAmount; // TongTien

    private String paymentMethod; // PhuongThucThanhToan

    @Column(nullable = false)
    private String paymentStatus; // TrangThaiThanhToan (e.g., SUCCESS, PENDING, FAILED)

    @PrePersist
    protected void onCreate() {
        if (createdDate == null) {
            createdDate = LocalDateTime.now();
        }
    }
}
