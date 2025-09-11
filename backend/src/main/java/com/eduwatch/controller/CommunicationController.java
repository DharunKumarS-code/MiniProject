package com.eduwatch.controller;

import com.eduwatch.service.CommunicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/communication")
@CrossOrigin(origins = "http://localhost:5173")
public class CommunicationController {
    
    @Autowired
    private CommunicationService communicationService;
    
    @PostMapping("/email")
    public ResponseEntity<Map<String, Object>> sendEmail(@RequestBody Map<String, String> request) {
        try {
            boolean sent = communicationService.sendEmail(
                request.get("to"),
                request.get("subject"),
                request.get("message")
            );
            return ResponseEntity.ok(Map.of("success", sent, "message", "Email sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PostMapping("/sms")
    public ResponseEntity<Map<String, Object>> sendSMS(@RequestBody Map<String, String> request) {
        try {
            boolean sent = communicationService.sendSMS(
                request.get("to"),
                request.get("message")
            );
            return ResponseEntity.ok(Map.of("success", sent, "message", "SMS sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}