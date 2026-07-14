package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // TenPhim

    private String director; // DaoDien

    private String cast; // DienVien

    private String genre; // TheLoai

    @Column(nullable = false)
    private Integer durationMinutes; // ThoiLuong (phút)

    private LocalDate releaseDate; // NgayKhoiChieu

    private String language; // NgonNgu

    @Column(columnDefinition = "TEXT")
    private String description; // TomTat

    private String posterUrl; // HinhAnh

    private String ageRating; // GioiHanTuoi (P, K, 13+, 16+, 18+)

    @Column(nullable = false)
    private String status; // TrangThai (VD: DANG_CHIEU, SAP_CHIEU, NGUNG_CHIEU)
}
