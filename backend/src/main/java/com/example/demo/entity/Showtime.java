package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "showtimes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Showtime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie; // PhimId

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room; // PhongId

    @Column(nullable = false)
    private LocalDate showDate; // NgayChieu

    @Column(nullable = false)
    private LocalTime startTime; // GioBatDau

    @Column(nullable = false)
    private LocalTime endTime; // GioKetThuc

    @Column(nullable = false)
    private Double basePrice; // GiaVeCoBan
}
