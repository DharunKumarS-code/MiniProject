package com.eduwatch.service;

import com.eduwatch.model.Student;
import com.eduwatch.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    public Optional<Student> getStudentById(String id) {
        return studentRepository.findById(id);
    }
    
    public Optional<Student> getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId);
    }
    
    public Student saveStudent(Student student) {
        calculateRiskLevel(student);
        return studentRepository.save(student);
    }
    
    public void deleteStudent(String id) {
        studentRepository.deleteById(id);
    }
    
    public List<Student> getStudentsByRiskLevel(String riskLevel) {
        return studentRepository.findByRiskLevel(riskLevel);
    }
    
    public long getStudentCountByRiskLevel(String riskLevel) {
        return studentRepository.countByRiskLevel(riskLevel);
    }
    
    private void calculateRiskLevel(Student student) {
        int riskScore = 0;
        
        if (student.getAttendancePercentage() < 75) riskScore += 3;
        else if (student.getAttendancePercentage() < 85) riskScore += 1;
        
        if (student.getAverageScore() < 60) riskScore += 3;
        else if (student.getAverageScore() < 75) riskScore += 1;
        
        if ("overdue".equals(student.getFeeStatus())) riskScore += 3;
        else if ("due".equals(student.getFeeStatus())) riskScore += 1;
        
        if (riskScore >= 5) student.setRiskLevel("high");
        else if (riskScore >= 2) student.setRiskLevel("medium");
        else student.setRiskLevel("low");
    }
}