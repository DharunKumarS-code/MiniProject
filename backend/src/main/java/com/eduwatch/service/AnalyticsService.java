package com.eduwatch.service;

import com.eduwatch.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalStudents = studentRepository.count();
        
        stats.put("totalStudents", totalStudents);
        stats.put("highRisk", studentRepository.countByRiskLevel("high"));
        stats.put("mediumRisk", studentRepository.countByRiskLevel("medium"));
        stats.put("lowRisk", studentRepository.countByRiskLevel("low"));
        stats.put("averageAttendance", calculateAverageAttendance());
        stats.put("averageScore", calculateAverageScore());
        
        return stats;
    }
    
    public Map<String, Object> getRiskTrends() {
        Map<String, Object> trends = new HashMap<>();
        
        // Mock trend data - in production, this would be calculated from historical data
        List<Map<String, Object>> weeklyTrends = Arrays.asList(
            Map.of("week", "Week 1", "high", 15, "medium", 25, "low", 60),
            Map.of("week", "Week 2", "high", 12, "medium", 28, "low", 60),
            Map.of("week", "Week 3", "high", 10, "medium", 30, "low", 60),
            Map.of("week", "Week 4", "high", 8, "medium", 32, "low", 60)
        );
        
        trends.put("weeklyTrends", weeklyTrends);
        trends.put("riskReduction", 7); // percentage improvement
        
        return trends;
    }
    
    public Map<String, Object> getPerformanceReport() {
        Map<String, Object> report = new HashMap<>();
        
        // Grade-wise performance
        Map<String, Object> gradePerformance = new HashMap<>();
        gradePerformance.put("Grade 9", Map.of("average", 78.5, "students", 45));
        gradePerformance.put("Grade 10", Map.of("average", 82.1, "students", 50));
        gradePerformance.put("Grade 11", Map.of("average", 75.8, "students", 42));
        gradePerformance.put("Grade 12", Map.of("average", 80.3, "students", 38));
        
        report.put("gradePerformance", gradePerformance);
        report.put("topPerformers", getTopPerformers());
        report.put("needsAttention", getNeedsAttention());
        
        return report;
    }
    
    public Map<String, Object> getAttendanceAnalysis() {
        Map<String, Object> analysis = new HashMap<>();
        
        analysis.put("overallAttendance", calculateAverageAttendance());
        analysis.put("attendanceTrends", getAttendanceTrends());
        analysis.put("lowAttendanceStudents", getLowAttendanceStudents());
        
        return analysis;
    }
    
    private double calculateAverageAttendance() {
        return studentRepository.findAll().stream()
                .mapToDouble(student -> student.getAttendancePercentage())
                .average()
                .orElse(0.0);
    }
    
    private double calculateAverageScore() {
        return studentRepository.findAll().stream()
                .mapToDouble(student -> student.getAverageScore())
                .average()
                .orElse(0.0);
    }
    
    private List<Map<String, Object>> getTopPerformers() {
        return studentRepository.findAll().stream()
                .filter(student -> student.getAverageScore() >= 90)
                .limit(10)
                .map(student -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", student.getName());
                    map.put("score", student.getAverageScore());
                    map.put("grade", student.getGrade());
                    return map;
                })
                .collect(Collectors.toList());
    }
    
    private List<Map<String, Object>> getNeedsAttention() {
        return studentRepository.findByRiskLevel("high").stream()
                .limit(10)
                .map(student -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", student.getName());
                    map.put("riskLevel", student.getRiskLevel());
                    map.put("attendance", student.getAttendancePercentage());
                    map.put("score", student.getAverageScore());
                    return map;
                })
                .collect(Collectors.toList());
    }
    
    private List<Map<String, Object>> getAttendanceTrends() {
        // Mock attendance trend data
        return Arrays.asList(
            Map.of("month", "January", "attendance", 85.2),
            Map.of("month", "February", "attendance", 87.1),
            Map.of("month", "March", "attendance", 83.8),
            Map.of("month", "April", "attendance", 86.5)
        );
    }
    
    private List<Map<String, Object>> getLowAttendanceStudents() {
        return studentRepository.findAll().stream()
                .filter(student -> student.getAttendancePercentage() < 75)
                .map(student -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", student.getName());
                    map.put("attendance", student.getAttendancePercentage());
                    map.put("grade", student.getGrade());
                    return map;
                })
                .collect(Collectors.toList());
    }
}