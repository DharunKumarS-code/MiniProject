package com.eduwatch.repository;

import com.eduwatch.model.Homework;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HomeworkRepository extends MongoRepository<Homework, String> {
    List<Homework> findByGrade(String grade);
    List<Homework> findBySubject(String subject);
    List<Homework> findByCreatedBy(String createdBy);
}