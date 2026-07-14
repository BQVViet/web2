package com.example.demo.service;

import com.example.demo.dto.FoodDrinkDTO;
import com.example.demo.entity.FoodDrink;
import com.example.demo.repository.FoodDrinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FoodDrinkService {

    private final FoodDrinkRepository foodDrinkRepository;

    public List<FoodDrinkDTO> getAllFoodDrinks() {
        return foodDrinkRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public FoodDrinkDTO getFoodDrinkById(Long id) {
        FoodDrink foodDrink = foodDrinkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FoodDrink not found"));
        return mapToDTO(foodDrink);
    }

    public FoodDrinkDTO createFoodDrink(FoodDrinkDTO dto) {
        boolean isActive = dto.getActive() == null ? true : dto.getActive();
        FoodDrink foodDrink = FoodDrink.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stockQuantity(dto.getStockQuantity())
                .imageUrl(dto.getImageUrl())
                .active(isActive)
                .build();
        return mapToDTO(foodDrinkRepository.save(foodDrink));
    }

    public FoodDrinkDTO updateFoodDrink(Long id, FoodDrinkDTO dto) {
        FoodDrink foodDrink = foodDrinkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FoodDrink not found"));

        foodDrink.setName(dto.getName());
        foodDrink.setDescription(dto.getDescription());
        foodDrink.setPrice(dto.getPrice());
        foodDrink.setStockQuantity(dto.getStockQuantity());
        foodDrink.setImageUrl(dto.getImageUrl());
        foodDrink.setActive(dto.getActive() == null ? foodDrink.getActive() : dto.getActive());
        return mapToDTO(foodDrinkRepository.save(foodDrink));
    }

    public void deleteFoodDrink(Long id) {
        foodDrinkRepository.deleteById(id);
    }

    private FoodDrinkDTO mapToDTO(FoodDrink foodDrink) {
        return FoodDrinkDTO.builder()
                .id(foodDrink.getId())
                .name(foodDrink.getName())
                .description(foodDrink.getDescription())
                .price(foodDrink.getPrice())
                .stockQuantity(foodDrink.getStockQuantity())
                .imageUrl(foodDrink.getImageUrl())
                .active(foodDrink.getActive())
                .build();
    }
}
