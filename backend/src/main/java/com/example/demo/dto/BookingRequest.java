package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequest {
    private Long showtimeId;
    private List<Long> seatIds;
    private Map<Long, Integer> foodDrinks;
    private Map<Long, String> foodFlavors;
    private String paymentMethod;
    private String voucherCode;
}


