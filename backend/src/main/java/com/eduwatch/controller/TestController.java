package com.eduwatch.controller;

import com.eduwatch.model.User;
import com.eduwatch.model.RegisterUser;
import com.eduwatch.model.LoginUser;
import com.eduwatch.model.Student;
import com.eduwatch.repository.UserRepository;
import com.eduwatch.repository.RegisterUserRepository;
import com.eduwatch.repository.LoginUserRepository;
import com.eduwatch.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RegisterUserRepository registerUserRepository;
    
    @Autowired
    private LoginUserRepository loginUserRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "Backend is running", "port", "8083"));
    }
    
    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, Object>> createAdmin() {
        try {
            if (!userRepository.existsByEmail("admin@school.edu")) {
                User admin = new User();
                admin.setEmail("admin@school.edu");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setName("Admin User");
                admin.setRole(User.Role.ADMIN);
                userRepository.save(admin);
                return ResponseEntity.ok(Map.of("success", true, "message", "Admin created"));
            }
            return ResponseEntity.ok(Map.of("success", true, "message", "Admin already exists"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    @PostMapping("/init-data")
    public ResponseEntity<Map<String, Object>> initializeData() {
        try {
            // Create admin
            if (!userRepository.existsByEmail("admin@school.edu")) {
                User admin = new User();
                admin.setEmail("admin@school.edu");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setName("Admin User");
                admin.setRole(User.Role.ADMIN);
                userRepository.save(admin);
            }
            
            // Create teacher
            if (!userRepository.existsByEmail("john.doe@school.edu")) {
                User teacher = new User();
                teacher.setEmail("john.doe@school.edu");
                teacher.setPassword(passwordEncoder.encode("teacher123"));
                teacher.setName("John Doe");
                teacher.setRole(User.Role.TEACHER);
                userRepository.save(teacher);
            }
            
            // Create RegisterUser data
            if (registerUserRepository.count() == 0) {
                RegisterUser regAdmin = new RegisterUser();
                regAdmin.setName("Admin User");
                regAdmin.setEmail("admin@school.edu");
                regAdmin.setPassword(passwordEncoder.encode("admin123"));
                regAdmin.setRole("ADMIN");
                registerUserRepository.save(regAdmin);
                
                RegisterUser regTeacher = new RegisterUser();
                regTeacher.setName("John Doe");
                regTeacher.setEmail("john.doe@school.edu");
                regTeacher.setPassword(passwordEncoder.encode("teacher123"));
                regTeacher.setRole("TEACHER");
                registerUserRepository.save(regTeacher);
            }
            
            // Create LoginUser data
            if (loginUserRepository.count() == 0) {
                LoginUser loginAdmin = new LoginUser();
                loginAdmin.setEmail("admin@school.edu");
                loginAdmin.setPassword(passwordEncoder.encode("admin123"));
                loginUserRepository.save(loginAdmin);
                
                LoginUser loginTeacher = new LoginUser();
                loginTeacher.setEmail("john.doe@school.edu");
                loginTeacher.setPassword(passwordEncoder.encode("teacher123"));
                loginUserRepository.save(loginTeacher);
            }
            
            // Create sample students
            if (studentRepository.count() == 0) {
                createSampleStudent("STU001", "Alice Johnson", "R001", "10", "A", 85.0, 78.0, "paid");
                createSampleStudent("STU002", "Bob Smith", "R002", "10", "A", 72.0, 65.0, "due");
                createSampleStudent("STU003", "Carol Davis", "R003", "10", "B", 95.0, 88.0, "paid");
                createSampleStudent("STU004", "David Wilson", "R004", "10", "B", 68.0, 55.0, "overdue");
            }
            
            return ResponseEntity.ok(Map.of("success", true, "message", "All sample data created successfully"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    private void createSampleStudent(String studentId, String name, String rollNo, String grade, String section, Double attendance, Double score, String feeStatus) {
        Student student = new Student();
        student.setStudentId(studentId);
        student.setName(name);
        student.setRollNo(rollNo);
        student.setGrade(grade);
        student.setSection(section);
        student.setDepartment("Science");
        student.setEmail(name.toLowerCase().replace(" ", ".") + "@student.edu");
        student.setPhone("+1-555-" + studentId.substring(3));
        student.setParentName("Parent of " + name);
        student.setParentEmail("parent." + name.toLowerCase().replace(" ", ".") + "@email.com");
        student.setParentPhone("+1-555-2" + studentId.substring(3));
        student.setAddress("123 Main St, City");
        student.setAttendancePercentage(attendance);
        student.setAverageScore(score);
        student.setFeeStatus(feeStatus);
        studentRepository.save(student);
    }
}