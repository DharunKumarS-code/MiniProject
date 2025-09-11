import React, { useState } from 'react';
import { FileText, Download, Calendar, Users, TrendingUp, Filter } from 'lucide-react';
import { useStudentContext } from '../contexts/StudentContext';

export const Reports = () => {
  const { students, filteredStudents } = useStudentContext();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportType, setReportType] = useState('summary');

  // Calculate real-time metrics
  const totalStudents = students.length;
  const highRiskStudents = students.filter(s => s.riskLevel === 'high').length;
  const mediumRiskStudents = students.filter(s => s.riskLevel === 'medium').length;
  const lowRiskStudents = students.filter(s => s.riskLevel === 'low').length;
  const avgAttendance = students.length > 0 ? (students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length).toFixed(1) : 0;
  const avgScore = students.length > 0 ? (students.reduce((sum, s) => sum + (s.avgScore || 0), 0) / students.length).toFixed(1) : 0;
  
  // Calculate risk factors distribution
  const riskFactorsCount = {};
  students.forEach(student => {
    if (student.riskFactors) {
      student.riskFactors.forEach(factor => {
        riskFactorsCount[factor] = (riskFactorsCount[factor] || 0) + 1;
      });
    }
  });
  
  const topRiskFactors = Object.entries(riskFactorsCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([factor, count]) => ({ factor, count, percentage: Math.round((count / totalStudents) * 100) }));

  const generateReport = (type, period) => {
    const reportData = {
      type,
      period,
      generatedAt: new Date().toISOString(),
      data: 'Sample report data would go here'
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_report_${period}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadReport = (report) => {
    const blob = new Blob(['Sample report content'], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const reports = [
    {
      title: 'Risk Assessment Summary',
      description: 'Overview of all students categorized by risk levels',
      type: 'summary',
      generated: '2024-01-15',
      size: '2.3 MB',
    },
    {
      title: 'High-Risk Students Detail',
      description: 'Detailed analysis of students requiring immediate attention',
      type: 'high-risk',
      generated: '2024-01-15',
      size: '1.8 MB',
    },
    {
      title: 'Attendance Trends Report',
      description: 'Monthly attendance patterns and predictions',
      type: 'attendance',
      generated: '2024-01-14',
      size: '3.1 MB',
    },
    {
      title: 'Academic Performance Analysis',
      description: 'Grade trends and subject-wise performance metrics',
      type: 'academic',
      generated: '2024-01-14',
      size: '2.7 MB',
    },
  ];

  const metrics = [
    { label: 'Total Students Analyzed', value: totalStudents.toString(), change: '+3.2%' },
    { label: 'High-Risk Identified', value: highRiskStudents.toString(), change: highRiskStudents > 0 ? '+12.5%' : '0%' },
    { label: 'Average Attendance', value: `${avgAttendance}%`, change: avgAttendance > 85 ? '+5.2%' : '-2.1%' },
    { label: 'Average Score', value: `${avgScore}%`, change: avgScore > 75 ? '+8.3%' : '-3.4%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Reports & Analytics</h2>
        <p className="text-gray-600">Generate comprehensive reports and track intervention effectiveness</p>
      </div>

      {/* Report Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Report Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="summary">Risk Assessment Summary</option>
              <option value="detailed">Detailed Analysis</option>
              <option value="trends">Trend Analysis</option>
              <option value="interventions">Intervention Tracking</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => generateReport(reportType, selectedPeriod)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">{metric.change}</span>
              <span className="text-sm text-gray-500 ml-1">from last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Available Reports */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Available Reports</h3>
          <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
            <Calendar className="h-4 w-4" />
            <span>Schedule Report</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div key={report.title} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{report.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Generated: {report.generated}</span>
                <span>Size: {report.size}</span>
              </div>
              
              <button 
                onClick={() => downloadReport(report)}
                className="mt-3 w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Distribution Analysis</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Current Risk Levels</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">High Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-red-500 rounded-full"
                      style={{ width: `${totalStudents > 0 ? (highRiskStudents / totalStudents) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {highRiskStudents} ({totalStudents > 0 ? Math.round((highRiskStudents / totalStudents) * 100) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Medium Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{ width: `${totalStudents > 0 ? (mediumRiskStudents / totalStudents) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {mediumRiskStudents} ({totalStudents > 0 ? Math.round((mediumRiskStudents / totalStudents) * 100) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Low Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${totalStudents > 0 ? (lowRiskStudents / totalStudents) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {lowRiskStudents} ({totalStudents > 0 ? Math.round((lowRiskStudents / totalStudents) * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Risk Factors Distribution</h4>
            <div className="space-y-3">
              {topRiskFactors.length > 0 ? topRiskFactors.map((item) => (
                <div key={item.factor} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.factor}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full">
                      <div
                        className="h-1.5 bg-blue-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-500 py-4">
                  <p>No risk factors data available</p>
                  <p className="text-sm">Import student data to see risk analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};