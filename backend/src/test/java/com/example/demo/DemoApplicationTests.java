package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;

@SpringBootTest
class DemoApplicationTests {

    @Autowired
    private JdbcTemplate jdbcTemplate;

	@Test
	void contextLoads() {
        System.out.println("=== INVOICE 47 DETAILS ===");
        try {
            List<Map<String, Object>> invoices = jdbcTemplate.queryForList("SELECT * FROM invoices WHERE id = 47");
            if (!invoices.isEmpty()) {
                System.out.println("Invoice: " + invoices.get(0));
            } else {
                System.out.println("Invoice 47 not found!");
            }
            List<Map<String, Object>> tickets = jdbcTemplate.queryForList("SELECT * FROM tickets WHERE invoice_id = 47");
            System.out.println("Tickets: " + tickets);
            List<Map<String, Object>> details = jdbcTemplate.queryForList("SELECT * FROM invoice_details WHERE invoice_id = 47");
            System.out.println("Invoice Details: " + details);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("==========================");
	}

}
