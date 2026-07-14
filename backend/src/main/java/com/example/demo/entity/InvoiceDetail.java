package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "invoice_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice; // HoaDonId

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_drink_id", nullable = false)
    private FoodDrink foodDrink; // ComboId

    @Column(nullable = false)
    private Integer quantity; // SoLuong

    private String flavor; // Vi bap rang bo (e.g., Ngot, Pho mai, Caramel, Man)
}

