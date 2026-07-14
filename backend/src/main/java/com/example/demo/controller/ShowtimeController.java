package com.example.demo.controller;

import com.example.demo.dto.ShowtimeDTO;
import com.example.demo.entity.Showtime;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.repository.TicketRepository;
import com.example.demo.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/showtimes")
@RequiredArgsConstructor
public class ShowtimeController {

    private final ShowtimeService showtimeService;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;

    @GetMapping
    public ResponseEntity<List<ShowtimeDTO>> getAllShowtimes() {
        return ResponseEntity.ok(showtimeService.getAllShowtimes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShowtimeDTO> getShowtimeById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(showtimeService.getShowtimeById(id));
    }

    @PostMapping
    public ResponseEntity<ShowtimeDTO> createShowtime(@RequestBody ShowtimeDTO dto) {
        return ResponseEntity.ok(showtimeService.createShowtime(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShowtimeDTO> updateShowtime(@PathVariable("id") Long id, @RequestBody ShowtimeDTO dto) {
        return ResponseEntity.ok(showtimeService.updateShowtime(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShowtime(@PathVariable("id") Long id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/seat-map")
    public ResponseEntity<Map<String, Object>> getSeatMapForShowtime(@PathVariable("id") Long id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        List<com.example.demo.entity.Ticket> ticketsForShowtime = ticketRepository.findByShowtimeId(id);
        List<Map<String, Object>> seats = seatRepository.findByRoomId(showtime.getRoom().getId()).stream()
                .map(seat -> {
                    String seatStatus = showtimeService.resolveSeatStatus(seat, ticketsForShowtime);
                    return Map.<String, Object>of(
                            "id", seat.getId(),
                            "rowNumber", seat.getRowNumber(),
                            "seatNumber", seat.getSeatNumber(),
                            "type", seat.getType(),
                            "status", seatStatus,
                            "roomId", showtime.getRoom().getId()
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "showtimeId", id,
                "roomId", showtime.getRoom().getId(),
                "seats", seats
        ));
    }

    @PostMapping("/{id}/book-seat/{seatId}")
    public ResponseEntity<Void> bookSeatForShowtime(@PathVariable("id") Long showtimeId, @PathVariable("seatId") Long seatId) {
        showtimeService.bookSeat(showtimeId, seatId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/release-seat/{seatId}")
    public ResponseEntity<Void> releaseSeatForShowtime(@PathVariable("id") Long showtimeId, @PathVariable("seatId") Long seatId) {
        showtimeService.releaseSeat(showtimeId, seatId);
        return ResponseEntity.ok().build();
    }
}

