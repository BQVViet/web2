package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "foods_drinks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodDrink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // TenCombo

    @Column(columnDefinition = "TEXT")
    private String description; // MoTa

    @Column(nullable = false)
    private Double price; // GiaTien

    @Column(nullable = false)
    private Integer stockQuantity; // SoLuongTon

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}
