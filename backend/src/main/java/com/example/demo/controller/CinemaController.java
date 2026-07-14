package com.example.demo.controller;

import com.example.demo.dto.CinemaDTO;
import com.example.demo.service.CinemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cinemas")
@RequiredArgsConstructor
public class CinemaController {

    private final CinemaService cinemaService;

    @GetMapping
    public ResponseEntity<List<CinemaDTO>> getAllCinemas() {
        return ResponseEntity.ok(cinemaService.getAllCinemas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CinemaDTO> getCinemaById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(cinemaService.getCinemaById(id));
    }

    @PostMapping
    public ResponseEntity<CinemaDTO> createCinema(@RequestBody CinemaDTO dto) {
        return ResponseEntity.ok(cinemaService.createCinema(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CinemaDTO> updateCinema(@PathVariable("id") Long id, @RequestBody CinemaDTO dto) {
        return ResponseEntity.ok(cinemaService.updateCinema(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCinema(@PathVariable("id") Long id) {
        cinemaService.deleteCinema(id);
        return ResponseEntity.noContent().build();
    }
}

