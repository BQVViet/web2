package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    private User getCurrentUser() {
        org.springframework.security.core.Authentication authentication = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Chưa đăng nhập");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUser();
        }
        throw new RuntimeException("Thông tin người dùng không hợp lệ");
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> result = userRepository.findAll().stream().map(user -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", user.getId());
            map.put("fullName", user.getFullName());
            map.put("email", user.getEmail());
            map.put("phone", user.getPhone());
            map.put("role", user.getRole());
            map.put("active", user.getActive() != null ? user.getActive() : true);
            map.put("createdAt", user.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", user.getId());
                    map.put("fullName", user.getFullName());
                    map.put("email", user.getEmail());
                    map.put("phone", user.getPhone());
                    map.put("role", user.getRole());
                    map.put("active", user.getActive() != null ? user.getActive() : true);
                    map.put("createdAt", user.getCreatedAt());
                    return ResponseEntity.ok(map);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Không tìm thấy người dùng."));
            }
            
            // Xóa dữ liệu liên quan (Cascade Delete thủ công)
            jdbcTemplate.update("DELETE FROM invoice_details WHERE invoice_id IN (SELECT id FROM invoices WHERE user_id = ?)", id);
            jdbcTemplate.update("DELETE FROM tickets WHERE invoice_id IN (SELECT id FROM invoices WHERE user_id = ?)", id);
            jdbcTemplate.update("DELETE FROM invoices WHERE user_id = ?", id);

            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Xóa người dùng thành công"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("success", false, "message", "Đã xảy ra lỗi hệ thống. Không thể xóa: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable("id") Long id, @RequestBody Map<String, String> payload) {
        return userRepository.findById(id).map(user -> {
            String newRole = payload.get("role");
            if (newRole != null && (newRole.equals("ADMIN") || newRole.equals("STAFF") || newRole.equals("CUSTOMER"))) {
                user.setRole(newRole);
                userRepository.save(user);
                return ResponseEntity.ok(Map.of("message", "Cập nhật vai trò thành công"));
            }
            return ResponseEntity.badRequest().body(Map.of("message", "Vai trò không hợp lệ"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable("id") Long id, @RequestBody Map<String, Boolean> payload) {
        return userRepository.findById(id).map(user -> {
            Boolean active = payload.get("active");
            if (active != null) {
                user.setActive(active);
                userRepository.save(user);
                return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái thành công"));
            }
            return ResponseEntity.badRequest().body(Map.of("message", "Trạng thái không hợp lệ"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            User currentUser = getCurrentUser();
            User freshUser = userRepository.findById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", freshUser.getId());
            map.put("fullName", freshUser.getFullName());
            map.put("email", freshUser.getEmail());
            map.put("phone", freshUser.getPhone());
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        try {
            User currentUser = getCurrentUser();
            User freshUser = userRepository.findById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            
            String fullName = payload.get("fullName");
            String phone = payload.get("phone");
            
            if (fullName != null) freshUser.setFullName(fullName);
            if (phone != null) freshUser.setPhone(phone);
            
            User saved = userRepository.save(freshUser);
            
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("fullName", saved.getFullName());
            map.put("email", saved.getEmail());
            map.put("phone", saved.getPhone());
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload) {
        try {
            User currentUser = getCurrentUser();
            User freshUser = userRepository.findById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            
            String oldPassword = payload.get("oldPassword");
            String newPassword = payload.get("newPassword");
            
            if (oldPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập mật khẩu cũ và mới."));
            }
            
            if (!passwordEncoder.matches(oldPassword, freshUser.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu cũ không chính xác."));
            }
            
            freshUser.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(freshUser);
            
            return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> payload) {
        String fullName = payload.get("fullName");
        String email = payload.get("email");
        String phone = payload.get("phone");
        String password = payload.get("password");
        String role = payload.get("role");

        if (fullName == null || email == null || password == null || role == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập đầy đủ thông tin bắt buộc."));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email đã tồn tại trong hệ thống."));
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setActive(true);

        User saved = userRepository.save(user);
        
        Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", saved.getId());
        map.put("fullName", saved.getFullName());
        map.put("email", saved.getEmail());
        map.put("phone", saved.getPhone());
        map.put("role", saved.getRole());
        map.put("active", saved.getActive() != null ? saved.getActive() : true);
        map.put("createdAt", saved.getCreatedAt());

        return ResponseEntity.ok(map);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") Long id, @RequestBody Map<String, String> payload) {
        return userRepository.findById(id).map(user -> {
            String fullName = payload.get("fullName");
            String email = payload.get("email");
            String phone = payload.get("phone");
            String password = payload.get("password");
            String role = payload.get("role");

            if (fullName != null) user.setFullName(fullName);
            if (phone != null) user.setPhone(phone);
            if (role != null) user.setRole(role);
            
            if (email != null && !email.trim().isEmpty() && !email.equalsIgnoreCase(user.getEmail())) {
                if (userRepository.findByEmail(email).isPresent()) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Email đã tồn tại trong hệ thống."));
                }
                user.setEmail(email);
            }

            if (password != null && !password.trim().isEmpty()) {
                user.setPassword(passwordEncoder.encode(password));
            }

            User saved = userRepository.save(user);

            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", saved.getId());
            map.put("fullName", saved.getFullName());
            map.put("email", saved.getEmail());
            map.put("phone", saved.getPhone());
            map.put("role", saved.getRole());
            map.put("active", saved.getActive() != null ? saved.getActive() : true);
            map.put("createdAt", saved.getCreatedAt());

            return ResponseEntity.ok(map);
        }).orElse(ResponseEntity.notFound().build());
    }
}
