package com.example.demo.controller;

import com.example.demo.entity.Voucher;
import com.example.demo.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherRepository voucherRepository;

    @GetMapping
    public ResponseEntity<List<Voucher>> getAllVouchers() {
        return ResponseEntity.ok(voucherRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Voucher> getVoucherById(@PathVariable("id") Long id) {
        return voucherRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createVoucher(@RequestBody Voucher voucher) {
        if (voucherRepository.findByCode(voucher.getCode().trim()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã voucher đã tồn tại!"));
        }
        voucher.setCode(voucher.getCode().trim().toUpperCase());
        return ResponseEntity.ok(voucherRepository.save(voucher));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVoucher(@PathVariable("id") Long id, @RequestBody Voucher voucherDetails) {
        return voucherRepository.findById(id)
                .map(voucher -> {
                    String newCode = voucherDetails.getCode().trim().toUpperCase();
                    if (!voucher.getCode().equalsIgnoreCase(newCode) &&
                            voucherRepository.findByCode(newCode).isPresent()) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Mã voucher đã tồn tại!"));
                    }
                    voucher.setCode(newCode);
                    voucher.setDiscountAmount(voucherDetails.getDiscountAmount());
                    voucher.setActive(voucherDetails.getActive());
                    return ResponseEntity.ok(voucherRepository.save(voucher));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoucher(@PathVariable("id") Long id) {
        return voucherRepository.findById(id)
                .map(voucher -> {
                    voucherRepository.delete(voucher);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/apply/{code}")
    public ResponseEntity<?> applyVoucher(@PathVariable("code") String code) {
        return voucherRepository.findByCode(code.trim().toUpperCase())
                .filter(Voucher::getActive)
                .map(v -> ResponseEntity.ok(Map.of(
                        "code", v.getCode(),
                        "discountAmount", v.getDiscountAmount()
                )))
                .orElse(ResponseEntity.badRequest().body(Map.of("message", "Mã khuyến mãi không hợp lệ hoặc đã hết hạn!")));
    }
}
