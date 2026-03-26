import React, { useState, useEffect } from 'react';
import { X, Clock, BookOpen, DollarSign, AlertTriangle, TrendingDown, Mail, Phone, User, Brain } from 'lucide-react';
import { predictStudentRisk } from '../../services/mlService';

export const StudentModal = ({ student, onClose }) => {
  const [mlPrediction, setMlPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getPrediction = async () => {
      try {
        const prediction = await predictStudentRisk(student);
        setMlPrediction(prediction);
      } catch (error) {
        console.error('ML prediction failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getPrediction();
  }, [student]);
  
  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
              <p className="text-gray-600">Student ID: {student.id} | Roll No: {student.rollNo || 'N/A'} | Grade {student.grade}-{student.section} | {student.department || 'General'}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRiskColor(student.riskLevel)}`}>
                Risk Level: {student.riskLevel === 'high' ? 'High Risk' : student.riskLevel === 'medium' ? 'Watch List' : 'On Track'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Metrics */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
            <div className="space-y-4">
              {student.attendance !== undefined && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Attendance</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{student.attendance}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${student.attendance < 75 ? 'bg-red-500' : student.attendance < 85 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${student.attendance}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {student.avgScore !== undefined && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Average Score</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{student.avgScore}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${student.avgScore < 60 ? 'bg-red-500' : student.avgScore < 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${student.avgScore}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {student.feesStatus && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">Fee Status</span>
                  </div>
                  <div className={`text-lg font-semibold ${student.feesStatus === 'paid' ? 'text-green-600' : student.feesStatus === 'due' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {student.feesStatus === 'paid' ? 'Paid' : student.feesStatus === 'due' ? 'Due Soon' : 'Overdue'}
                  </div>
                </div>
              )}
              
              {!student.attendance && !student.avgScore && !student.feesStatus && (
                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                  <p>No performance data available</p>
                  <p className="text-sm">Import attendance, assessment, or fee data to see metrics</p>
                </div>
              )}
            </div>
          </div>

          {/* Risk Analysis */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Analysis</h3>
            
            {student.riskFactors && student.riskFactors.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">Risk Factors Identified</span>
                </div>
                <ul className="space-y-2">
                  {student.riskFactors.map((factor, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-red-800">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Recent Attendance</h4>
                <div className="space-y-2">
                  {[
                    { date: 'Mon 15/1', status: 'present' },
                    { date: 'Tue 16/1', status: 'absent' },
                    { date: 'Wed 17/1', status: 'present' },
                    { date: 'Thu 18/1', status: 'present' },
                    { date: 'Fri 19/1', status: 'absent' },
                  ].map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{day.date}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${day.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {day.status === 'present' ? 'Present' : 'Absent'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Recent Scores</h4>
                <div className="space-y-2">
                  {[
                    { subject: 'Mathematics', score: 78 },
                    { subject: 'Physics', score: 65 },
                    { subject: 'Chemistry', score: 72 },
                    { subject: 'English', score: 85 },
                    { subject: 'Biology', score: 58 },
                  ].map((test, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{test.subject}</span>
                      <span className={`font-medium ${test.score < 60 ? 'text-red-600' : test.score < 75 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {test.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>*/}

            <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">AI Dropout Risk Assessment</h4>
                {mlPrediction && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {mlPrediction.confidence}% confidence
                  </span>
                )}
              </div>
              
              {loading ? (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Analyzing student data...</span>
                </div>
              ) : mlPrediction ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">Dropout Risk Score:</span>
                    <span className="font-semibold text-blue-900">{mlPrediction.riskProbability}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        mlPrediction.riskProbability > 70 ? 'bg-red-500' : 
                        mlPrediction.riskProbability > 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${mlPrediction.riskProbability}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-blue-800">
                    <strong>Recommendation:</strong> {mlPrediction.recommendation}
                  </p>
                  <p className="text-xs text-blue-700">
                    <strong>Intervention Timeframe:</strong> {mlPrediction.timeframe}
                  </p>
                  {mlPrediction.factors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-blue-700 mb-1"><strong>Key Factors:</strong></p>
                      <ul className="text-xs text-blue-600 space-y-1">
                        {mlPrediction.factors.map((factor, index) => (
                          <li key={index} className="flex items-start space-x-1">
                            <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-blue-700">Unable to generate prediction. Please try again.</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact & Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h4 className="font-medium text-gray-900">Contact Information</h4>
              <div className="flex flex-col space-y-2">
                <div className="text-sm text-gray-600">
                  <p><strong>Student:</strong> {student.email || 'No email'} | {student.contactPhone || 'No phone'}</p>
                  <p><strong>Parent:</strong> {student.parentName || 'N/A'} | {student.parentEmail || 'No email'} | {student.parentPhone || 'No phone'}</p>
                  {student.address && <p><strong>Address:</strong> {student.address}</p>}
                </div>
                <div className="flex space-x-2">
                  {student.parentEmail && (
                    <button 
                      onClick={() => window.open(`mailto:${student.parentEmail}?subject=Student Update - ${student.name}&body=Dear ${student.parentName || 'Parent'},%0A%0AI am writing to discuss ${student.name}'s academic progress.%0A%0ABest regards`)}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Email Parent</span>
                    </button>
                  )}
                  {student.parentPhone && (
                    <button 
                      onClick={() => window.open(`tel:${student.parentPhone}`)}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call Parent</span>
                    </button>
                  )}
                  {student.email && (
                    <button 
                      onClick={() => window.open(`mailto:${student.email}?subject=Academic Update&body=Dear ${student.name},%0A%0AI wanted to discuss your academic progress.%0A%0ABest regards`)}
                      className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Email Student</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  const meetingDate = new Date();
                  meetingDate.setDate(meetingDate.getDate() + 7);
                  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Parent-Teacher Meeting - ${student.name}&dates=${meetingDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${meetingDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Meeting to discuss ${student.name}'s academic progress`;
                  window.open(calendarUrl, '_blank');
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Schedule Meeting
              </button>
              <button 
                onClick={() => {
                  if (student.parentPhone) {
                    const message = `Alert: ${student.name} requires attention. Risk Level: ${student.riskLevel}. Please contact the school.`;
                    window.open(`sms:${student.parentPhone}?body=${encodeURIComponent(message)}`, '_blank');
                  } else {
                    alert('No parent phone number available for SMS alert');
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Send Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};