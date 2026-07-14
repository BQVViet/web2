package com.example.demo.service;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null && !request.getRole().isEmpty() ? request.getRole() : "CUSTOMER");
        
        userRepository.save(user);

        var userDetails = new CustomUserDetails(user);
        var jwtToken = jwtService.generateToken(userDetails);
        
        AuthResponse response = new AuthResponse();
        response.setToken(jwtToken);
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());
        return response;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        
        var userDetails = new CustomUserDetails(user);
        var jwtToken = jwtService.generateToken(userDetails);
        
        AuthResponse response = new AuthResponse();
        response.setToken(jwtToken);
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());
        return response;
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống!"));
        
        // Generate random password
        String newPassword = generateRandomPassword();
        
        try {
            // Send email FIRST to ensure SMTP works before modifying password
            String emailContent = "Xin chào " + user.getFullName() + ",\n\n" +
                    "Bạn đã yêu cầu khôi phục mật khẩu trên hệ thống đặt vé xem phim CGV.\n" +
                    "Mật khẩu mới của bạn là: " + newPassword + "\n\n" +
                    "Vui lòng sử dụng mật khẩu này để đăng nhập và đổi mật khẩu mới để bảo mật tài khoản.\n\n" +
                    "Trân trọng,\n" +
                    "CGV Cinemas Vietnam Support Team";
            
            emailService.sendSimpleMessage(email, "Khôi phục mật khẩu - CGV Cinemas", emailContent);
            
            // Save encoded password to DB only if email sent successfully
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Không thể gửi email khôi phục mật khẩu. Chi tiết lỗi: " + e.getMessage());
        }
    }

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new java.util.Random();
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
