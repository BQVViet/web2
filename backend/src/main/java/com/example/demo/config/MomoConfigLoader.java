package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

@Component
public class MomoConfigLoader {

    @Value("${momo.payurl:https://test-payment.momo.vn/web/index.99f86f8b.js}")
    private String payUrl;

    @Value("${momo.returnurl:http://localhost:8080/api/invoices/momo-callback}")
    private String returnUrl;

    @Value("${momo.notifyurl:http://localhost:8080/api/invoices/momo-notify}")
    private String notifyUrl;

    @Value("${momo.accesskey:F8590EC0C6CB49FBBEBA3B3C49910418}")
    private String accessKey;

    @Value("${momo.secretkey:K951B6PE1waDMi640xQKMv7DlH7oH885}")
    private String secretKey;

    @Value("${momo.partnercode:MOMO}")
    private String partnerCode;

    @PostConstruct
    public void init() {
        MomoConfig.momo_PayUrl = payUrl;
        MomoConfig.momo_ReturnUrl = returnUrl;
        MomoConfig.momo_NotifyUrl = notifyUrl;
        MomoConfig.momo_AccessKey = accessKey;
        MomoConfig.momo_SecretKey = secretKey;
        MomoConfig.momo_PartnerCode = partnerCode;
    }
}
