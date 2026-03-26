package com.eduwatch.controller;

import com.eduwatch.model.RegisterUser;
import com.eduwatch.model.LoginUser;
import com.eduwatch.repository.RegisterUserRepository;
import com.eduwatch.repository.LoginUserRepository;
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
    private RegisterUserRepository registerUserRepository;
    
    @Autowired
    private LoginUserRepository loginUserRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        return loginUserRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("user", Map.of(
                        "id", user.getId(),
                        "email", user.getEmail()
                    ));
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid credentials")));
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterUser user) {
        if (registerUserRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email already exists"));
        }
        
        // Save to register_users collection
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        RegisterUser savedUser = registerUserRepository.save(user);
        
        // Also save email and password to login_users collection
        LoginUser loginUser = new LoginUser();
        loginUser.setEmail(savedUser.getEmail());
        loginUser.setPassword(savedUser.getPassword());
        loginUserRepository.save(loginUser);
        
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