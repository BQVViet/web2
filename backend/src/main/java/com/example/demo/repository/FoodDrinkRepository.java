package com.example.demo.repository;

import com.example.demo.entity.FoodDrink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodDrinkRepository extends JpaRepository<FoodDrink, Long> {
}
