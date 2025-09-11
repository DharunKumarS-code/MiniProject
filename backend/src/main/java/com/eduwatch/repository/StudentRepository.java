package com.eduwatch.repository;

import com.eduwatch.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByStudentId(String studentId);
    List<Student> findByRiskLevel(String riskLevel);
    List<Student> findByGrade(String grade);
    
    long countByRiskLevel(String riskLevel);
}