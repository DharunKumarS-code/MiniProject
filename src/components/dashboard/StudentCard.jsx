import React from 'react';
import { AlertTriangle, Clock, DollarSign, BookOpen, Mail, Phone } from 'lucide-react';

export const StudentCard = ({ student, onClick }) => {
  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLabel = (level) => {
    switch (level) {
      case 'high': return 'High Risk';
      case 'medium': return 'Watch';
      case 'low': return 'On Track';
      default: return 'Unknown';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all duration-200 ${getRiskColor(student.riskLevel)}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{student.name}</h4>
          <p className="text-sm text-gray-600">ID: {student.id} | Grade {student.grade}-{student.section}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskBadge(student.riskLevel)}`}>
          {getRiskLabel(student.riskLevel)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Attendance</span>
          </div>
          <span className={`font-medium ${student.attendance < 75 ? 'text-red-600' : student.attendance < 85 ? 'text-yellow-600' : 'text-green-600'}`}>
            {student.attendance}%
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Avg Score</span>
          </div>
          <span className={`font-medium ${student.avgScore < 60 ? 'text-red-600' : student.avgScore < 75 ? 'text-yellow-600' : 'text-green-600'}`}>
            {student.avgScore}%
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Fees</span>
          </div>
          <span className={`font-medium ${student.feesStatus === 'overdue' ? 'text-red-600' : student.feesStatus === 'due' ? 'text-yellow-600' : 'text-green-600'}`}>
            {student.feesStatus === 'paid' ? 'Paid' : student.feesStatus === 'due' ? 'Due' : 'Overdue'}
          </span>
        </div>
      </div>

      {student.riskFactors && student.riskFactors.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <AlertTriangle className="h-3 w-3" />
            <span>{student.riskFactors.slice(0, 2).join(', ')}</span>
            {student.riskFactors.length > 2 && <span>+{student.riskFactors.length - 2} more</span>}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex space-x-2">
          {student.contactEmail && (
            <Mail 
              onClick={(e) => {
                e.stopPropagation();
                window.open(`mailto:${student.contactEmail}?subject=Student Update - ${student.name}`);
              }}
              className="h-4 w-4 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" 
            />
          )}
          {student.contactPhone && (
            <Phone 
              onClick={(e) => {
                e.stopPropagation();
                window.open(`tel:${student.contactPhone}`);
              }}
              className="h-4 w-4 text-gray-400 hover:text-green-600 cursor-pointer transition-colors" 
            />
          )}
        </div>
        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
          View Details →
        </button>
      </div>
    </div>
  );
};