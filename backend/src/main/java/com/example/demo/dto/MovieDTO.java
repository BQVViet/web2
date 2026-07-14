package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MovieDTO {
    private Long id;
    private String title;
    private String director;
    private String cast;
    private String genre;
    private Integer durationMinutes;
    private LocalDate releaseDate;
    private String language;
    private String description;
    private String posterUrl;
    private String ageRating;
    private String status;
}
