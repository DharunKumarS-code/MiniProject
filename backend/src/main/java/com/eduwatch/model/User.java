package com.eduwatch.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import jakarta.validation.constraints.*;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    @Indexed(unique = true)
    @Email
    private String email;
    
    @NotBlank
    private String password;
    
    @NotBlank
    private String name;
    
    private Role role = Role.TEACHER;
    
    public enum Role {
        ADMIN, TEACHER
    }
    
    // Constructors
    public User() {}
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}