package com.eduwatch.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "lesson_plans")
public class LessonPlan {
    @Id
    private String id;
    private String title;
    private String subject;
    private String grade;
    private String duration;
    private String objective;
    private List<String> activities;
    private String assessment;
    private LocalDateTime createdAt = LocalDateTime.now();
    private String createdBy;
    
    public LessonPlan() {}
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    
    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }
    
    public List<String> getActivities() { return activities; }
    public void setActivities(List<String> activities) { this.activities = activities; }
    
    public String getAssessment() { return assessment; }
    public void setAssessment(String assessment) { this.assessment = assessment; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}