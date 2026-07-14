package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.RoomDTO;
import com.example.demo.entity.Cinema;
import com.example.demo.entity.Room;
import com.example.demo.entity.Seat;
import com.example.demo.repository.CinemaRepository;
import com.example.demo.repository.RoomRepository;
import com.example.demo.repository.SeatRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomService {

    private final RoomRepository roomRepository;
    private final CinemaRepository cinemaRepository;
    private final SeatRepository seatRepository;

    public List<RoomDTO> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public RoomDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return mapToDTO(room);
    }

    public RoomDTO createRoom(RoomDTO dto) {
        Cinema cinema = cinemaRepository.findById(dto.getCinemaId())
                .orElseThrow(() -> new RuntimeException("Cinema not found"));

        Room room = Room.builder()
                .name(dto.getName())
                .capacity(dto.getCapacity())
                .status(dto.getStatus())
                .cinema(cinema)
                .build();
        Room savedRoom = roomRepository.saveAndFlush(room);

        // Tự động sinh sơ đồ ghế dựa trên sức chứa khi tạo phòng mới
        int capacity = dto.getCapacity() != null ? dto.getCapacity() : 40;
        int rowCount = Math.max(3, Math.min(10, (int) Math.ceil((double) capacity / 10)));
        int seatsPerRow = Math.max(6, (int) Math.ceil((double) capacity / rowCount));
        
        for (int rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            String rowLetter = String.valueOf((char) ('A' + rowIndex));
            if (rowIndex == rowCount - 1) {
                // Hàng cuối cùng luôn là ghế đôi (COUPLE)
                int coupleCount = seatsPerRow / 2;
                for (int seatIndex = 1; seatIndex <= coupleCount; seatIndex++) {
                    Seat seat = Seat.builder()
                            .rowNumber(rowLetter)
                            .seatNumber(seatIndex)
                            .type("COUPLE")
                            .status("AVAILABLE")
                            .room(savedRoom)
                            .build();
                    seatRepository.save(seat);
                }
            } else {
                // Hàng giữa là ghế VIP, hàng đầu là ghế STANDARD
                boolean isVIPRow = rowIndex >= rowCount / 3 && rowIndex < rowCount - 1;
                String seatType = isVIPRow ? "VIP" : "STANDARD";
                for (int seatIndex = 1; seatIndex <= seatsPerRow; seatIndex++) {
                    Seat seat = Seat.builder()
                            .rowNumber(rowLetter)
                            .seatNumber(seatIndex)
                            .type(seatType)
                            .status("AVAILABLE")
                            .room(savedRoom)
                            .build();
                    seatRepository.save(seat);
                }
            }
        }

        return mapToDTO(savedRoom);
    }


    public RoomDTO updateRoom(Long id, RoomDTO dto) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        Cinema cinema = cinemaRepository.findById(dto.getCinemaId())
                .orElseThrow(() -> new RuntimeException("Cinema not found"));

        room.setName(dto.getName());
        room.setCapacity(dto.getCapacity());
        room.setStatus(dto.getStatus());
        room.setCinema(cinema);
        return mapToDTO(roomRepository.save(room));
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    private RoomDTO mapToDTO(Room room) {
        return RoomDTO.builder()
                .id(room.getId())
                .name(room.getName())
                .capacity(room.getCapacity())
                .status(room.getStatus())
                .cinemaId(room.getCinema().getId())
                .build();
    }
}
