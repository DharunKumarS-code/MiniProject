package com.eduwatch.repository;

import com.eduwatch.model.LessonPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonPlanRepository extends MongoRepository<LessonPlan, String> {
    List<LessonPlan> findByGrade(String grade);
    List<LessonPlan> findBySubject(String subject);
    List<LessonPlan> findByCreatedBy(String createdBy);
}