package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SeatDTO {
    private Long id;
    private String rowNumber;
    private Integer seatNumber;
    private String type;
    private String status;
    private Long roomId;
}
