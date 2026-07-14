package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public CommandLineRunner databaseCleanup(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.execute("DELETE s1 FROM seats s1 INNER JOIN seats s2 " +
						"WHERE s1.id > s2.id " +
						"AND s1.room_id = s2.room_id " +
						"AND s1.row_number = s2.row_number " +
						"AND s1.seat_number = s2.seat_number");
				System.out.println("Cleaned up duplicate seats successfully from startup runner.");
			} catch (Exception e) {
				System.err.println("Failed to clean up duplicate seats: " + e.getMessage());
			}
		};
	}
}
