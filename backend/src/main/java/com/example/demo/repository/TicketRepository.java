package com.example.demo.repository;

import com.example.demo.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByInvoiceId(Long invoiceId);

    List<Ticket> findByShowtimeId(Long showtimeId);

    boolean existsBySeatId(Long seatId);

    @org.springframework.data.jpa.repository.Query("SELECT t.showtime.movie.id, t.showtime.movie.title, COUNT(t.id), SUM(t.price) FROM Ticket t GROUP BY t.showtime.movie.id, t.showtime.movie.title ORDER BY COUNT(t.id) DESC")
    List<Object[]> getTopMovies();
}
