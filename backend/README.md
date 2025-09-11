# EduWatch Backend

Spring Boot backend for the EduWatch student monitoring system.

## Prerequisites

- Java 17+
- Maven 3.6+
- MongoDB (local or cloud)

## Setup

1. **Install MongoDB locally** or use MongoDB Atlas
2. **Update connection string** in `application.properties` if needed
3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/students/stats` - Get student statistics
- `POST /api/import/students` - Import students from CSV

## Default Users

- Admin: admin@school.edu / admin123
- Teacher: john.doe@school.edu / teacher123

Server runs on http://localhost:8080