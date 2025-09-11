package com.eduwatch.service;

import com.eduwatch.dto.StudentImportRequest;
import com.eduwatch.model.Student;
import com.eduwatch.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DataImportService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private StudentService studentService;
    
    public Map<String, Object> importData(StudentImportRequest request) {
        Map<String, Object> result = new HashMap<>();
        int processed = 0;
        int errors = 0;
        
        for (Map<String, String> row : request.getData()) {
            try {
                switch (request.getType()) {
                    case "students":
                        importStudentData(row);
                        break;
                    case "attendance":
                        updateAttendance(row);
                        break;
                    case "assessment":
                        updateAssessment(row);
                        break;
                    case "fees":
                        updateFeeStatus(row);
                        break;
                }
                processed++;
            } catch (Exception e) {
                errors++;
            }
        }
        
        result.put("success", true);
        result.put("processed", processed);
        result.put("errors", errors);
        return result;
    }
    
    private void importStudentData(Map<String, String> row) {
        Student student = new Student();
        student.setStudentId(row.get("Student ID"));
        student.setName(row.get("Name"));
        student.setRollNo(row.get("Roll No"));
        student.setGrade(row.get("Grade"));
        student.setSection(row.get("Section"));
        student.setDepartment(row.get("Department"));
        student.setEmail(row.get("Email"));
        student.setPhone(row.get("Phone"));
        student.setParentName(row.get("Parent Name"));
        student.setParentEmail(row.get("Parent Email"));
        student.setParentPhone(row.get("Parent Phone"));
        student.setAddress(row.get("Address"));
        
        studentService.saveStudent(student);
    }
    
    private void updateAttendance(Map<String, String> row) {
        String studentId = row.get("Student ID");
        Double attendance = Double.parseDouble(row.get("Attendance %"));
        
        studentRepository.findByStudentId(studentId).ifPresent(student -> {
            student.setAttendancePercentage(attendance);
            studentService.saveStudent(student);
        });
    }
    
    private void updateAssessment(Map<String, String> row) {
        String studentId = row.get("Student ID");
        Double score = Double.parseDouble(row.get("Average Score"));
        
        studentRepository.findByStudentId(studentId).ifPresent(student -> {
            student.setAverageScore(score);
            studentService.saveStudent(student);
        });
    }
    
    private void updateFeeStatus(Map<String, String> row) {
        String studentId = row.get("Student ID");
        String status = row.get("Status");
        
        studentRepository.findByStudentId(studentId).ifPresent(student -> {
            student.setFeeStatus(status);
            studentService.saveStudent(student);
        });
    }
}