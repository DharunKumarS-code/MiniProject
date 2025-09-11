import React, { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext(undefined);

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
};



export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    riskLevel: '',
    grade: '',
    section: '',
  });
  
  const [riskThresholds, setRiskThresholds] = useState({
    attendance: { high: 75, medium: 85 },
    grades: { high: 60, medium: 75 },
    fees: { overdue: 30, due: 7 },
  });

  // Start with empty data - only show imported data
  useEffect(() => {
    // No initial data - dashboard will be empty until data is imported
  }, []);

  // Filter students based on current filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = filters.search === '' || 
      student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      student.id.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesRiskLevel = filters.riskLevel === '' || student.riskLevel === filters.riskLevel;
    const matchesGrade = filters.grade === '' || student.grade === filters.grade;
    const matchesSection = filters.section === '' || student.section === filters.section;
    
    return matchesSearch && matchesRiskLevel && matchesGrade && matchesSection;
  });

  const updateRiskThresholds = (newThresholds) => {
    setRiskThresholds(newThresholds);
    // Recalculate risk levels for all students
    const updatedStudents = students.map(student => {
      let riskLevel = 'low';
      const riskFactors = [];
      
      if (student.attendance < newThresholds.attendance.high) {
        riskLevel = 'high';
        riskFactors.push('Poor attendance record');
      } else if (student.attendance < newThresholds.attendance.medium) {
        riskLevel = 'medium';
        riskFactors.push('Declining attendance');
      }
      
      if (student.avgScore < newThresholds.grades.high) {
        riskLevel = 'high';
        riskFactors.push('Low academic performance');
      } else if (student.avgScore < newThresholds.grades.medium) {
        if (riskLevel !== 'high') riskLevel = 'medium';
        riskFactors.push('Declining grades');
      }
      
      if (student.feesStatus === 'overdue') {
        riskLevel = 'high';
        riskFactors.push('Overdue fee payments');
      } else if (student.feesStatus === 'due') {
        if (riskLevel !== 'high') riskLevel = 'medium';
        riskFactors.push('Pending fee payment');
      }
      
      return { ...student, riskLevel, riskFactors };
    });
    
    setStudents(updatedStudents);
  };

  const importData = (type, data) => {
    setStudents(prevStudents => {
      const studentMap = new Map(prevStudents.map(s => [s.id, s]));
      
      // Process each imported record
      data.forEach(item => {
        const existingStudent = studentMap.get(item.studentId);
        
        if (existingStudent) {
          // Update existing student
          const updatedStudent = { ...existingStudent, ...item, lastUpdated: new Date() };
          studentMap.set(item.studentId, calculateRiskLevel(updatedStudent));
        } else {
          // Create new student from imported data
          const newStudent = {
            id: item.studentId,
            name: item.name || `Student ${item.studentId}`,
            grade: item.grade || '10',
            section: item.section || 'A',
            attendance: item.attendance || 100,
            avgScore: item.avgScore || 85,
            feesStatus: item.feesStatus || 'paid',
            contactEmail: item.contactEmail || '',
            contactPhone: item.contactPhone || '',
            lastUpdated: new Date()
          };
          studentMap.set(item.studentId, calculateRiskLevel(newStudent));
        }
      });
      
      return Array.from(studentMap.values());
    });
  };

  const calculateRiskLevel = (student) => {
    let riskLevel = 'low';
    const riskFactors = [];
    
    const attendance = student.attendance || 100;
    const avgScore = student.avgScore || 85;
    const feesStatus = student.feesStatus || 'paid';
    
    if (attendance < riskThresholds.attendance.high) {
      riskLevel = 'high';
      riskFactors.push('Poor attendance record');
    } else if (attendance < riskThresholds.attendance.medium) {
      riskLevel = 'medium';
      riskFactors.push('Declining attendance');
    }
    
    if (avgScore < riskThresholds.grades.high) {
      riskLevel = 'high';
      riskFactors.push('Low academic performance');
    } else if (avgScore < riskThresholds.grades.medium) {
      if (riskLevel !== 'high') riskLevel = 'medium';
      riskFactors.push('Declining grades');
    }
    
    if (feesStatus === 'overdue') {
      riskLevel = 'high';
      riskFactors.push('Overdue fee payments');
    } else if (feesStatus === 'due') {
      if (riskLevel !== 'high') riskLevel = 'medium';
      riskFactors.push('Pending fee payment');
    }
    
    return { ...student, riskLevel, riskFactors };
  };

  const addStudent = (studentData) => {
    const newStudent = {
      id: `STU${(students.length + 1).toString().padStart(3, '0')}`,
      ...studentData,
      lastUpdated: new Date(),
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (studentId, updates) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, ...updates, lastUpdated: new Date() }
          : student
      )
    );
  };

  const deleteStudent = (studentId) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
  };

  const value = {
    students,
    filteredStudents,
    filters,
    riskThresholds,
    setFilters,
    updateRiskThresholds,
    importData,
    addStudent,
    updateStudent,
    deleteStudent,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};