package com.eduwatch.controller;

import com.eduwatch.model.LessonPlan;
import com.eduwatch.model.Homework;
import com.eduwatch.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {
    
    @Autowired
    private AIService aiService;
    
    @PostMapping("/lesson-plan")
    public ResponseEntity<LessonPlan> generateLessonPlan(@RequestBody Map<String, String> request) {
        LessonPlan lessonPlan = aiService.generateLessonPlan(
            request.get("subject"),
            request.get("topic"),
            request.get("grade"),
            request.get("duration")
        );
        return ResponseEntity.ok(lessonPlan);
    }
    
    @PostMapping("/homework")
    public ResponseEntity<Homework> generateHomework(@RequestBody Map<String, String> request) {
        Homework homework = aiService.generateHomework(
            request.get("subject"),
            request.get("topic"),
            request.get("grade"),
            request.get("difficulty")
        );
        return ResponseEntity.ok(homework);
    }
    
    @PostMapping("/grade")
    public ResponseEntity<Map<String, Object>> gradeSubmission(@RequestBody Map<String, String> request) {
        Map<String, Object> result = aiService.gradeSubmission(
            request.get("questions"),
            request.get("answers")
        );
        return ResponseEntity.ok(result);
    }
}