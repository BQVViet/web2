package com.example.demo.service;

import com.example.demo.dto.MovieDTO;
import com.example.demo.entity.Movie;
import com.example.demo.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MovieService {

    private final MovieRepository movieRepository;

    public List<MovieDTO> getAllMovies() {
        return movieRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public MovieDTO getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        return mapToDTO(movie);
    }

    public MovieDTO createMovie(MovieDTO dto) {
        Movie movie = mapToEntity(dto);
        Movie savedMovie = movieRepository.save(movie);
        return mapToDTO(savedMovie);
    }

    public MovieDTO updateMovie(Long id, MovieDTO dto) {
        Movie existing = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        existing.setTitle(dto.getTitle());
        existing.setDirector(dto.getDirector());
        existing.setCast(dto.getCast());
        existing.setGenre(dto.getGenre());
        existing.setDurationMinutes(dto.getDurationMinutes());
        existing.setReleaseDate(dto.getReleaseDate());
        existing.setLanguage(dto.getLanguage());
        existing.setDescription(dto.getDescription());
        existing.setPosterUrl(dto.getPosterUrl());
        existing.setAgeRating(dto.getAgeRating());
        existing.setStatus(dto.getStatus());

        Movie updated = movieRepository.save(existing);
        return mapToDTO(updated);
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

    private MovieDTO mapToDTO(Movie entity) {
        return MovieDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .director(entity.getDirector())
                .cast(entity.getCast())
                .genre(entity.getGenre())
                .durationMinutes(entity.getDurationMinutes())
                .releaseDate(entity.getReleaseDate())
                .language(entity.getLanguage())
                .description(entity.getDescription())
                .posterUrl(entity.getPosterUrl())
                .ageRating(entity.getAgeRating())
                .status(entity.getStatus())
                .build();
    }

    private Movie mapToEntity(MovieDTO dto) {
        return Movie.builder()
                .title(dto.getTitle())
                .director(dto.getDirector())
                .cast(dto.getCast())
                .genre(dto.getGenre())
                .durationMinutes(dto.getDurationMinutes())
                .releaseDate(dto.getReleaseDate())
                .language(dto.getLanguage())
                .description(dto.getDescription())
                .posterUrl(dto.getPosterUrl())
                .ageRating(dto.getAgeRating())
                .status(dto.getStatus())
                .build();
    }
}
