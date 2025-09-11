import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock teacher and admin data
const mockUsers = {
  teachers: [
    { id: 'T001', email: 'john.doe@school.edu', password: 'teacher123', name: 'John Doe', department: 'Mathematics', subjects: ['Algebra', 'Calculus'] },
    { id: 'T002', email: 'jane.smith@school.edu', password: 'teacher123', name: 'Jane Smith', department: 'Science', subjects: ['Physics', 'Chemistry'] },
    { id: 'T003', email: 'mike.wilson@school.edu', password: 'teacher123', name: 'Mike Wilson', department: 'English', subjects: ['Literature', 'Grammar'] }
  ],
  admin: { id: 'ADMIN', email: 'admin@school.edu', password: 'admin123', name: 'School Administrator' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, userType) => {
    try {
      let foundUser = null;
      
      if (userType === 'admin') {
        if (mockUsers.admin.email === email && mockUsers.admin.password === password) {
          foundUser = { ...mockUsers.admin, role: 'admin' };
        }
      } else {
        const teacher = mockUsers.teachers.find(t => t.email === email && t.password === password);
        if (teacher) {
          foundUser = { ...teacher, role: 'teacher' };
        }
      }

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const newTeacher = {
        id: `T${(mockUsers.teachers.length + 1).toString().padStart(3, '0')}`,
        ...userData,
        role: 'teacher'
      };
      
      mockUsers.teachers.push(newTeacher);
      setUser(newTeacher);
      localStorage.setItem('currentUser', JSON.stringify(newTeacher));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const getAllTeachers = () => {
    return mockUsers.teachers;
  };

  const updateTeacher = (teacherId, updates) => {
    const teacherIndex = mockUsers.teachers.findIndex(t => t.id === teacherId);
    if (teacherIndex !== -1) {
      mockUsers.teachers[teacherIndex] = { ...mockUsers.teachers[teacherIndex], ...updates };
      return true;
    }
    return false;
  };

  const deleteTeacher = (teacherId) => {
    const teacherIndex = mockUsers.teachers.findIndex(t => t.id === teacherId);
    if (teacherIndex !== -1) {
      mockUsers.teachers.splice(teacherIndex, 1);
      return true;
    }
    return false;
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    getAllTeachers,
    updateTeacher,
    deleteTeacher,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTeacher: user?.role === 'teacher'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};