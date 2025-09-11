# EduWatch - Student Risk Monitoring Dashboard

A comprehensive teacher dashboard system for monitoring student engagement and identifying early warning signs of academic risk.

## 🚀 Features

### Authentication & User Management
- **Teacher Login/Registration** with role-based access
- **Admin Dashboard** for managing teachers and system settings
- **Secure Authentication** with email/password

### Student Risk Monitoring
- **Real-time Risk Assessment** based on attendance, grades, and fee status
- **Dynamic Risk Level Calculation** (High/Medium/Low)
- **Risk Factor Identification** and tracking
- **ML-based Predictions** for intervention needs

### Data Management
- **CSV Data Import** for student details, attendance, assessments, and fees
- **Real-time Data Processing** and validation
- **Bulk Student Information Upload**
- **Contact Information Management**

### Communication Tools
- **Email Integration** for parent/student communication
- **SMS Alerts** for urgent notifications
- **Meeting Scheduler** with Google Calendar integration
- **Contact Management** with parent and student details

### AI-Powered Teaching Tools
- **AI Lesson Plan Generator** - Create structured lesson plans from topics
- **AI Homework Creator** - Generate custom assignments with difficulty levels
- **Auto Grading System** - Automatic grading and feedback for submissions

### Analytics & Reporting
- **Real-time Analytics Dashboard** with live metrics
- **Risk Distribution Analysis** and trends
- **Performance Tracking** and reporting
- **Export Capabilities** for reports and data

## 🛠️ Technology Stack

- **Frontend**: React 18, Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: PostCSS, Autoprefixer

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/techcc-cmd/SIH-project.git
   cd SIH-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Demo Credentials

### Admin Access
- **Email**: admin@school.edu
- **Password**: admin123

### Teacher Access
- **Email**: john.doe@school.edu
- **Password**: teacher123

## 📊 Data Import Format

### Student Details CSV Format
```csv
Student ID,Name,Roll No,Grade,Section,Department,Email,Phone,Parent Name,Parent Email,Parent Phone,Address
STU001,John Doe,R001,10,A,Science,john.doe@student.edu,+1-555-1001,Robert Doe,robert.doe@email.com,+1-555-2001,123 Main St
```

### Attendance CSV Format
```csv
Student ID,Attendance %
STU001,85
STU002,92
```

### Assessment CSV Format
```csv
Student ID,Average Score
STU001,78
STU002,85
```

### Fee Status CSV Format
```csv
Student ID,Status
STU001,paid
STU002,due
```

## 🎯 Usage

1. **Login** with teacher or admin credentials
2. **Import Student Data** using the Data Import section
3. **Monitor Risk Levels** on the main dashboard
4. **Use AI Tools** for lesson planning and homework creation
5. **Contact Parents/Students** directly from student profiles
6. **Generate Reports** for analysis and tracking

## 🏗️ Project Structure

```
src/
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── Login.jsx          # Authentication
│   ├── Register.jsx       # Teacher registration
│   ├── AdminDashboard.jsx # Admin panel
│   ├── AIFeatures.jsx     # AI teaching tools
│   ├── DataImport.jsx     # CSV import functionality
│   └── Reports.jsx        # Analytics and reporting
├── contexts/
│   ├── AuthContext.jsx    # Authentication state
│   ├── StudentContext.jsx # Student data management
│   └── NotificationContext.jsx # Notifications
└── App.jsx               # Main application
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features Explained

### Risk Assessment Algorithm
The system automatically calculates risk levels based on:
- **Attendance**: <75% = High Risk, <85% = Medium Risk
- **Academic Performance**: <60% = High Risk, <75% = Medium Risk  
- **Fee Status**: Overdue = High Risk, Due = Medium Risk

### AI Teaching Assistant
- **Lesson Plans**: Generate structured plans with objectives, activities, and assessments
- **Homework Creation**: Create custom assignments with multiple question types
- **Auto Grading**: Process and grade student submissions automatically

### Communication Integration
- **Email**: Pre-filled templates for parent/student communication
- **SMS**: Direct alert system for urgent notifications
- **Calendar**: Google Calendar integration for meeting scheduling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React.js, Tailwind CSS
- **Data Management**: CSV processing, real-time updates
- **AI Integration**: Lesson planning, homework generation, auto-grading
- **Communication**: Email/SMS integration, calendar scheduling

## 🆘 Support

For support, email support@eduwatch.com or create an issue in the GitHub repository.

## 🔮 Future Enhancements

- [ ] Mobile app development
- [ ] Advanced ML models for prediction
- [ ] Integration with school management systems
- [ ] Multi-language support
- [ ] Advanced analytics and insights
- [ ] Parent portal access