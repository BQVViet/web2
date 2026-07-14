package com.example.demo.service;

import com.example.demo.entity.Invoice;
import com.example.demo.entity.Seat;
import com.example.demo.entity.Ticket;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ShowtimeServiceTest {

    @Test
    void shouldMarkSeatBookedWhenInvoiceIsSuccessfulOrPending() {
        Seat seat = new Seat();
        seat.setId(10L);
        seat.setStatus("AVAILABLE");

        Ticket bookedTicket = Ticket.builder()
                .seat(seat)
                .invoice(Invoice.builder().paymentStatus("SUCCESS").build())
                .build();

        assertEquals("BOOKED", ShowtimeService.resolveSeatStatus(seat, List.of(bookedTicket)));
    }

    @Test
    void shouldKeepSeatAvailableWhenInvoiceIsFailed() {
        Seat seat = new Seat();
        seat.setId(10L);
        seat.setStatus("AVAILABLE");

        Ticket failedTicket = Ticket.builder()
                .seat(seat)
                .invoice(Invoice.builder().paymentStatus("FAILED").build())
                .build();

        assertEquals("AVAILABLE", ShowtimeService.resolveSeatStatus(seat, List.of(failedTicket)));
    }
}
