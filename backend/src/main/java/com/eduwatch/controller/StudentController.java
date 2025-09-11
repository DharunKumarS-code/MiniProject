package com.eduwatch.controller;

import com.eduwatch.model.Student;
import com.eduwatch.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {
    
    @Autowired
    private StudentService studentService;
    
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable String id) {
        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable String id, @RequestBody Student student) {
        return studentService.getStudentById(id)
                .map(existingStudent -> {
                    student.setId(id);
                    return ResponseEntity.ok(studentService.saveStudent(student));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable String id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/risk/{level}")
    public List<Student> getStudentsByRiskLevel(@PathVariable String level) {
        return studentService.getStudentsByRiskLevel(level);
    }
    
    @GetMapping("/stats")
    public Map<String, Object> getStudentStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", studentService.getAllStudents().size());
        stats.put("high", studentService.getStudentCountByRiskLevel("high"));
        stats.put("medium", studentService.getStudentCountByRiskLevel("medium"));
        stats.put("low", studentService.getStudentCountByRiskLevel("low"));
        return stats;
    }
}