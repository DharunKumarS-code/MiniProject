package com.eduwatch.controller;

import com.eduwatch.model.Student;
import com.eduwatch.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/import")
@CrossOrigin(origins = "http://localhost:5173")
public class DataImportController {
    
    @Autowired
    private StudentService studentService;
    
    @PostMapping("/students")
    public ResponseEntity<Map<String, Object>> importStudents(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        int imported = 0;
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line = reader.readLine(); // Skip header
            
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length >= 11) {
                    Student student = new Student();
                    student.setStudentId(data[0].trim());
                    student.setName(data[1].trim());
                    student.setRollNo(data[2].trim());
                    student.setGrade(data[3].trim());
                    student.setSection(data[4].trim());
                    student.setDepartment(data[5].trim());
                    student.setEmail(data[6].trim());
                    student.setPhone(data[7].trim());
                    student.setParentName(data[8].trim());
                    student.setParentEmail(data[9].trim());
                    student.setParentPhone(data[10].trim());
                    if (data.length > 11) student.setAddress(data[11].trim());
                    
                    studentService.saveStudent(student);
                    imported++;
                }
            }
            
            response.put("success", true);
            response.put("imported", imported);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/attendance")
    public ResponseEntity<Map<String, Object>> importAttendance(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        int updated = 0;
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line = reader.readLine(); // Skip header
            
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length >= 2) {
                    String studentId = data[0].trim();
                    Double attendance = Double.parseDouble(data[1].trim());
                    
                    studentService.getStudentByStudentId(studentId).ifPresent(student -> {
                        student.setAttendancePercentage(attendance);
                        studentService.saveStudent(student);
                    });
                    updated++;
                }
            }
            
            response.put("success", true);
            response.put("updated", updated);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}