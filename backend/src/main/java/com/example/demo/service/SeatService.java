package com.example.demo.service;

import com.example.demo.dto.SeatDTO;
import com.example.demo.entity.Room;
import com.example.demo.entity.Seat;
import com.example.demo.repository.RoomRepository;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class SeatService {

    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;
    private final TicketRepository ticketRepository;

    public void deleteSeatsByRoomId(Long roomId) {
        List<Seat> roomSeats = seatRepository.findByRoomId(roomId);
        for (Seat seat : roomSeats) {
            if (ticketRepository.existsBySeatId(seat.getId())) {
                throw new RuntimeException("Cannot delete seats because seat " + 
                        seat.getRowNumber() + seat.getSeatNumber() + " has already been booked!");
            }
        }
        seatRepository.deleteAll(roomSeats);
    }

    public List<SeatDTO> getAllSeats() {
        return seatRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SeatDTO getSeatById(Long id) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        return mapToDTO(seat);
    }

    public SeatDTO createSeat(SeatDTO dto) {
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Seat seat = Seat.builder()
                .rowNumber(dto.getRowNumber())
                .seatNumber(dto.getSeatNumber())
                .type(dto.getType())
                .status(dto.getStatus() != null ? dto.getStatus() : "AVAILABLE")
                .room(room)
                .build();
        return mapToDTO(seatRepository.save(seat));
    }

    public SeatDTO updateSeat(Long id, SeatDTO dto) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        seat.setRowNumber(dto.getRowNumber());
        seat.setSeatNumber(dto.getSeatNumber());
        seat.setType(dto.getType());
        seat.setStatus(dto.getStatus() != null ? dto.getStatus() : "AVAILABLE");
        seat.setRoom(room);
        return mapToDTO(seatRepository.save(seat));
    }

    public void deleteSeat(Long id) {
        seatRepository.deleteById(id);
    }

    private SeatDTO mapToDTO(Seat seat) {
        return SeatDTO.builder()
                .id(seat.getId())
                .rowNumber(seat.getRowNumber())
                .seatNumber(seat.getSeatNumber())
                .type(seat.getType())
                .status(seat.getStatus())
                .roomId(seat.getRoom().getId())
                .build();
    }
}
