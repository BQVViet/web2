package com.example.demo.config;

import java.nio.charset.StandardCharsets;
import java.util.Random;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class MomoConfig {
    public static String momo_PayUrl = "https://test-payment.momo.vn/web/index.99f86f8b.js"; // Sandbox
    public static String momo_ReturnUrl = "http://localhost:8080/api/invoices/momo-callback";
    public static String momo_NotifyUrl = "http://localhost:8080/api/invoices/momo-notify";
    public static String momo_AccessKey = "F8590EC0C6CB49FBBEBA3B3C49910418";
    public static String momo_SecretKey = "K951B6PE1waDMi640xQKMv7DlH7oH885";
    public static String momo_PartnerCode = "MOMO";
    
    public static String hmacSHA256(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac256 = Mac.getInstance("HmacSHA256");
            byte[] hmacKeyBytes = key.getBytes(StandardCharsets.UTF_8);
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA256");
            hmac256.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac256.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception ex) {
            return "";
        }
    }

    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
