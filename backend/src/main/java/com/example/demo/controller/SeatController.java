package com.example.demo.controller;

import com.example.demo.dto.SeatDTO;
import com.example.demo.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping
    public ResponseEntity<List<SeatDTO>> getAllSeats() {
        return ResponseEntity.ok(seatService.getAllSeats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeatDTO> getSeatById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(seatService.getSeatById(id));
    }

    @PostMapping
    public ResponseEntity<SeatDTO> createSeat(@RequestBody SeatDTO dto) {
        return ResponseEntity.ok(seatService.createSeat(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeatDTO> updateSeat(@PathVariable("id") Long id, @RequestBody SeatDTO dto) {
        return ResponseEntity.ok(seatService.updateSeat(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeat(@PathVariable("id") Long id) {
        seatService.deleteSeat(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/room/{roomId}")
    public ResponseEntity<Void> deleteSeatsByRoomId(@PathVariable("roomId") Long roomId) {
        seatService.deleteSeatsByRoomId(roomId);
        return ResponseEntity.noContent().build();
    }
}

