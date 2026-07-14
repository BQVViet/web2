package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

@Component
public class VNPayConfigLoader {

    @Value("${vnp.tmncode:ORX5X3G0}")
    private String tmnCode;

    @Value("${vnp.hashsecret:Z3B1BDC29C1BJGZM6EZ5CNM4KZR2W1LW}")
    private String hashSecret;

    @Value("${vnp.payurl:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String payUrl;

    @Value("${vnp.returnurl:http://localhost:8080/api/invoices/vnpay-callback}")
    private String returnUrl;

    @PostConstruct
    public void init() {
        VNPayConfig.vnp_TmnCode = tmnCode;
        VNPayConfig.vnp_HashSecret = hashSecret;
        VNPayConfig.vnp_PayUrl = payUrl;
        VNPayConfig.vnp_ReturnUrl = returnUrl;
    }
}
