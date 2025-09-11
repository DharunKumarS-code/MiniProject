package com.eduwatch.config;

import com.eduwatch.model.User;
import com.eduwatch.model.Student;
import com.eduwatch.repository.UserRepository;
import com.eduwatch.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create admin user
        if (!userRepository.existsByEmail("admin@school.edu")) {
            User admin = new User();
            admin.setEmail("admin@school.edu");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setName("Admin User");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
        }
        
        if (!userRepository.existsByEmail("john.doe@school.edu")) {
            User teacher = new User();
            teacher.setEmail("john.doe@school.edu");
            teacher.setPassword(passwordEncoder.encode("teacher123"));
            teacher.setName("John Doe");
            teacher.setRole(User.Role.TEACHER);
            userRepository.save(teacher);
        }
        
        // Create sample students
        if (studentRepository.count() == 0) {
            createSampleStudent("STU001", "Alice Johnson", "R001", "10", "A", 85.0, 78.0, "paid");
            createSampleStudent("STU002", "Bob Smith", "R002", "10", "A", 72.0, 65.0, "due");
            createSampleStudent("STU003", "Carol Davis", "R003", "10", "B", 95.0, 88.0, "paid");
            createSampleStudent("STU004", "David Wilson", "R004", "10", "B", 68.0, 55.0, "overdue");
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