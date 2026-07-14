package com.example.demo.controller;

import com.example.demo.dto.FoodDrinkDTO;
import com.example.demo.service.FoodDrinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-drinks")
@RequiredArgsConstructor
public class FoodDrinkController {

    private final FoodDrinkService foodDrinkService;

    @GetMapping
    public ResponseEntity<List<FoodDrinkDTO>> getAllFoodDrinks() {
        return ResponseEntity.ok(foodDrinkService.getAllFoodDrinks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodDrinkDTO> getFoodDrinkById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(foodDrinkService.getFoodDrinkById(id));
    }

    @PostMapping
    public ResponseEntity<FoodDrinkDTO> createFoodDrink(@RequestBody FoodDrinkDTO dto) {
        return ResponseEntity.ok(foodDrinkService.createFoodDrink(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodDrinkDTO> updateFoodDrink(@PathVariable("id") Long id, @RequestBody FoodDrinkDTO dto) {
        return ResponseEntity.ok(foodDrinkService.updateFoodDrink(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoodDrink(@PathVariable("id") Long id) {
        foodDrinkService.deleteFoodDrink(id);
        return ResponseEntity.noContent().build();
    }
}

