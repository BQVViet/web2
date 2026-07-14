package com.example.demo.service;

import com.example.demo.dto.BannerDTO;
import com.example.demo.entity.Banner;
import com.example.demo.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class BannerService {

    private final BannerRepository bannerRepository;

    public List<BannerDTO> getAllBanners() {
        return bannerRepository.findAll().stream().map(banner -> mapToDTO(banner)).collect(Collectors.toList());
    }

    public List<BannerDTO> getActiveBanners() {
        return bannerRepository.findByActiveTrue().stream().map(banner -> mapToDTO(banner)).collect(Collectors.toList());
    }

    public BannerDTO getBannerById(Long id) {
        Banner banner = bannerRepository.findById(id).orElseThrow(() -> new RuntimeException("Banner not found"));
        return mapToDTO(banner);
    }

    public BannerDTO createBanner(BannerDTO dto) {
        Banner banner = new Banner();
        banner.setImageUrl(dto.getImageUrl());
        banner.setTargetUrl(dto.getTargetUrl());
        banner.setTitle(dto.getTitle());
        banner.setActive(dto.isActive());
        return mapToDTO(bannerRepository.save(banner));
    }

    public BannerDTO updateBanner(Long id, BannerDTO dto) {
        Banner banner = bannerRepository.findById(id).orElseThrow(() -> new RuntimeException("Banner not found"));
        banner.setImageUrl(dto.getImageUrl());
        banner.setTargetUrl(dto.getTargetUrl());
        banner.setTitle(dto.getTitle());
        banner.setActive(dto.isActive());
        return mapToDTO(bannerRepository.save(banner));
    }

    public void deleteBanner(Long id) {
        bannerRepository.deleteById(id);
    }

    private BannerDTO mapToDTO(Banner banner) {
        BannerDTO dto = new BannerDTO();
        dto.setId(banner.getId());
        dto.setImageUrl(banner.getImageUrl());
        dto.setTargetUrl(banner.getTargetUrl());
        dto.setTitle(banner.getTitle());
        dto.setActive(banner.isActive());
        return dto;
    }
}
