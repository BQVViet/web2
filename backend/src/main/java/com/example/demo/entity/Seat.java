package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String rowNumber; // e.g., A, B, C

    @Column(nullable = false)
    private Integer seatNumber; // e.g., 1, 2, 3

    @Column(nullable = false)
    private String type; // e.g., NORMAL, VIP

    @Column(nullable = false)
    private String status; // AVAILABLE, BOOKED, DISABLED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
}
