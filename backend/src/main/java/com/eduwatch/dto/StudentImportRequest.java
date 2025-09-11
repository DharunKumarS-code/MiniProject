package com.eduwatch.dto;

import java.util.List;
import java.util.Map;

public class StudentImportRequest {
    private String type; // "students", "attendance", "assessment", "fees"
    private List<Map<String, String>> data;
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public List<Map<String, String>> getData() { return data; }
    public void setData(List<Map<String, String>> data) { this.data = data; }
}