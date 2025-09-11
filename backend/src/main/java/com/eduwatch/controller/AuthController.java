package com.eduwatch.controller;

import com.eduwatch.model.User;
import com.eduwatch.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("user", Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "name", user.getName(),
                        "role", user.getRole()
                    ));
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid credentials")));
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email already exists"));
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", Map.of(
            "id", savedUser.getId(),
            "email", savedUser.getEmail(),
            "name", savedUser.getName(),
            "role", savedUser.getRole()
        ));
        return ResponseEntity.ok(response);
    }
}