package com.eduwatch.service;

import com.eduwatch.model.LessonPlan;
import com.eduwatch.model.Homework;
import com.eduwatch.repository.LessonPlanRepository;
import com.eduwatch.repository.HomeworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AIService {
    
    @Autowired
    private LessonPlanRepository lessonPlanRepository;
    
    @Autowired
    private HomeworkRepository homeworkRepository;
    
    public LessonPlan generateLessonPlan(String subject, String topic, String grade, String duration) {
        LessonPlan lessonPlan = new LessonPlan();
        lessonPlan.setSubject(subject);
        lessonPlan.setTitle(topic);
        lessonPlan.setGrade(grade);
        lessonPlan.setDuration(duration);
        
        // Mock AI-generated content
        lessonPlan.setObjective(generateObjectives(subject, topic, grade));
        lessonPlan.setActivities(Arrays.asList(generateActivities(subject, topic, grade).split("\\n")));
        lessonPlan.setAssessment(generateAssessment(subject, topic, grade));
        
        return lessonPlanRepository.save(lessonPlan);
    }
    
    public Homework generateHomework(String subject, String topic, String grade, String difficulty) {
        Homework homework = new Homework();
        homework.setSubject(subject);
        homework.setTitle(topic + " - " + difficulty + " Level");
        homework.setGrade(grade);
        homework.setDifficulty(difficulty);
        
        // Mock AI-generated content
        homework.setDescription(generateQuestions(subject, topic, difficulty) + "\n\n" + generateInstructions(subject, difficulty));
        
        return homeworkRepository.save(homework);
    }
    
    public Map<String, Object> gradeSubmission(String questions, String answers) {
        Map<String, Object> result = new HashMap<>();
        
        // Mock auto-grading logic
        int totalQuestions = questions.split("\\n").length;
        int correctAnswers = (int) (Math.random() * totalQuestions);
        double score = (double) correctAnswers / totalQuestions * 100;
        
        result.put("score", Math.round(score));
        result.put("totalQuestions", totalQuestions);
        result.put("correctAnswers", correctAnswers);
        result.put("feedback", generateFeedback(score));
        
        return result;
    }
    
    private String generateObjectives(String subject, String topic, String grade) {
        return String.format("Students will be able to:\n1. Understand key concepts of %s\n2. Apply %s principles\n3. Analyze and evaluate %s scenarios", topic, topic, topic);
    }
    
    private String generateActivities(String subject, String topic, String grade) {
        return String.format("1. Introduction to %s (10 min)\n2. Interactive discussion on %s concepts (15 min)\n3. Hands-on practice activities (20 min)\n4. Group work and presentations (10 min)\n5. Summary and Q&A (5 min)", topic, topic);
    }
    
    private String generateAssessment(String subject, String topic, String grade) {
        return String.format("1. Formative: Exit ticket with 3 key questions about %s\n2. Summative: Quiz on %s concepts next class\n3. Performance: Observation during group activities", topic, topic);
    }
    
    private String generateResources(String subject, String topic) {
        return String.format("1. Textbook chapters on %s\n2. Online videos and simulations\n3. Worksheets and practice problems\n4. Interactive whiteboard materials", topic);
    }
    
    private String generateQuestions(String subject, String topic, String difficulty) {
        String[] questions = {
            String.format("1. Define %s and explain its importance in %s.", topic, subject),
            String.format("2. List three key characteristics of %s.", topic),
            String.format("3. Provide an example of %s in real life.", topic),
            String.format("4. Compare and contrast %s with related concepts.", topic),
            String.format("5. Analyze the impact of %s on modern society.", topic)
        };
        return String.join("\n", questions);
    }
    
    private String generateInstructions(String subject, String difficulty) {
        return String.format("Instructions:\n1. Answer all questions completely\n2. Show your work for calculations\n3. Use proper %s terminology\n4. Submit by the due date\n5. Difficulty level: %s", subject, difficulty);
    }
    
    private String generateFeedback(double score) {
        if (score >= 90) return "Excellent work! You have mastered the concepts.";
        else if (score >= 80) return "Good job! Minor areas for improvement.";
        else if (score >= 70) return "Satisfactory. Review the concepts and practice more.";
        else return "Needs improvement. Please review the material and seek help.";
    }
}