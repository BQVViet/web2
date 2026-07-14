package com.example.demo.controller;

import com.example.demo.dto.BannerDTO;
import com.example.demo.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    public ResponseEntity<List<BannerDTO>> getAllBanners() {
        return ResponseEntity.ok(bannerService.getAllBanners());
    }

    @GetMapping("/active")
    public ResponseEntity<List<BannerDTO>> getActiveBanners() {
        return ResponseEntity.ok(bannerService.getActiveBanners());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BannerDTO> getBannerById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bannerService.getBannerById(id));
    }

    @PostMapping
    public ResponseEntity<BannerDTO> createBanner(@RequestBody BannerDTO bannerDTO) {
        return ResponseEntity.ok(bannerService.createBanner(bannerDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BannerDTO> updateBanner(@PathVariable("id") Long id, @RequestBody BannerDTO bannerDTO) {
        return ResponseEntity.ok(bannerService.updateBanner(id, bannerDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable("id") Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }
}

