package com.eduwatch.controller;

import com.eduwatch.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }
    
    @GetMapping("/risk-trends")
    public ResponseEntity<Map<String, Object>> getRiskTrends() {
        return ResponseEntity.ok(analyticsService.getRiskTrends());
    }
    
    @GetMapping("/performance-report")
    public ResponseEntity<Map<String, Object>> getPerformanceReport() {
        return ResponseEntity.ok(analyticsService.getPerformanceReport());
    }
    
    @GetMapping("/attendance-analysis")
    public ResponseEntity<Map<String, Object>> getAttendanceAnalysis() {
        return ResponseEntity.ok(analyticsService.getAttendanceAnalysis());
    }
}