package com.example.demo.controller;

import com.example.demo.entity.Promotion;
import com.example.demo.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionRepository promotionRepository;

    @GetMapping
    public ResponseEntity<List<Promotion>> getActivePromotions() {
        return ResponseEntity.ok(promotionRepository.findByActiveTrue());
    }

    @PostMapping
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        return ResponseEntity.ok(promotionRepository.save(promotion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Promotion> updatePromotion(@PathVariable("id") Long id, @RequestBody Promotion promotion) {
        return promotionRepository.findById(id).map(existing -> {
            existing.setTitle(promotion.getTitle());
            existing.setDescription(promotion.getDescription());
            existing.setImageUrl(promotion.getImageUrl());
            existing.setTargetUrl(promotion.getTargetUrl());
            existing.setActive(promotion.getActive());
            return ResponseEntity.ok(promotionRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable("id") Long id) {
        promotionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
