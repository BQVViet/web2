package com.example.demo.service;

import com.example.demo.dto.CinemaDTO;
import com.example.demo.entity.Cinema;
import com.example.demo.repository.CinemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CinemaService {

    private final CinemaRepository cinemaRepository;

    public List<CinemaDTO> getAllCinemas() {
        return cinemaRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CinemaDTO getCinemaById(Long id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cinema not found"));
        return mapToDTO(cinema);
    }

    public CinemaDTO createCinema(CinemaDTO dto) {
        Cinema cinema = Cinema.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .phone(dto.getPhone())
                .build();
        return mapToDTO(cinemaRepository.save(cinema));
    }

    public CinemaDTO updateCinema(Long id, CinemaDTO dto) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cinema not found"));
        cinema.setName(dto.getName());
        cinema.setAddress(dto.getAddress());
        cinema.setPhone(dto.getPhone());
        return mapToDTO(cinemaRepository.save(cinema));
    }

    public void deleteCinema(Long id) {
        cinemaRepository.deleteById(id);
    }

    private CinemaDTO mapToDTO(Cinema cinema) {
        return CinemaDTO.builder()
                .id(cinema.getId())
                .name(cinema.getName())
                .address(cinema.getAddress())
                .phone(cinema.getPhone())
                .build();
    }
}
