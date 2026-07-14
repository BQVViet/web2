package com.example.demo.service;

import com.example.demo.dto.ShowtimeDTO;
import com.example.demo.entity.Movie;
import com.example.demo.entity.Room;
import com.example.demo.entity.Seat;
import com.example.demo.entity.Showtime;
import com.example.demo.entity.Ticket;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.RoomRepository;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;

    public void bookSeat(Long showtimeId, Long seatId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        boolean alreadyBooked = ticketRepository.findByShowtimeId(showtimeId).stream()
                .anyMatch(t -> t.getSeat() != null && seatId.equals(t.getSeat().getId()));
        if (alreadyBooked) {
            return;
        }

        Ticket ticket = Ticket.builder()
                .showtime(showtime)
                .seat(seat)
                .price(showtime.getBasePrice())
                .status("BOOKED")
                .build();
        ticketRepository.save(ticket);
    }

    public void releaseSeat(Long showtimeId, Long seatId) {
        List<Ticket> tickets = ticketRepository.findByShowtimeId(showtimeId);
        for (Ticket ticket : tickets) {
            if (ticket.getSeat() != null && seatId.equals(ticket.getSeat().getId())) {
                ticketRepository.delete(ticket);
                break;
            }
        }
    }

    public List<ShowtimeDTO> getAllShowtimes() {
        return showtimeRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ShowtimeDTO getShowtimeById(Long id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        return mapToDTO(showtime);
    }

    public ShowtimeDTO createShowtime(ShowtimeDTO dto) {
        Movie movie = movieRepository.findById(dto.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Showtime showtime = Showtime.builder()
                .movie(movie)
                .room(room)
                .showDate(dto.getShowDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .basePrice(dto.getBasePrice())
                .build();
        return mapToDTO(showtimeRepository.save(showtime));
    }

    public ShowtimeDTO updateShowtime(Long id, ShowtimeDTO dto) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        Movie movie = movieRepository.findById(dto.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setShowDate(dto.getShowDate());
        showtime.setStartTime(dto.getStartTime());
        showtime.setEndTime(dto.getEndTime());
        showtime.setBasePrice(dto.getBasePrice());
        return mapToDTO(showtimeRepository.save(showtime));
    }

    public void deleteShowtime(Long id) {
        showtimeRepository.deleteById(id);
    }

    public static String resolveSeatStatus(Seat seat, List<Ticket> ticketsForShowtime) {
        if (seat == null) {
            return "AVAILABLE";
        }

        if ("DISABLED".equalsIgnoreCase(seat.getStatus())) {
            return "DISABLED";
        }

        if (ticketsForShowtime == null || ticketsForShowtime.isEmpty()) {
            return "AVAILABLE";
        }

        Ticket matchingTicket = ticketsForShowtime.stream()
                .filter(ticket -> ticket != null
                        && ticket.getSeat() != null
                        && seat.getId() != null
                        && seat.getId().equals(ticket.getSeat().getId()))
                .findFirst()
                .orElse(null);

        if (matchingTicket == null) {
            return "AVAILABLE";
        }

        if (matchingTicket.getInvoice() != null) {
            String paymentStatus = matchingTicket.getInvoice().getPaymentStatus();
            if ("FAILED".equalsIgnoreCase(paymentStatus)
                    || "CANCELLED".equalsIgnoreCase(paymentStatus)
                    || "CANCELED".equalsIgnoreCase(paymentStatus)) {
                return "AVAILABLE";
            }
        }

        return "BOOKED";
    }

    private ShowtimeDTO mapToDTO(Showtime showtime) {
        return ShowtimeDTO.builder()
                .id(showtime.getId())
                .movieId(showtime.getMovie().getId())
                .roomId(showtime.getRoom().getId())
                .showDate(showtime.getShowDate())
                .startTime(showtime.getStartTime())
                .endTime(showtime.getEndTime())
                .basePrice(showtime.getBasePrice())
                .build();
    }
}
