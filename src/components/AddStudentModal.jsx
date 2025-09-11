import React, { useState } from 'react';
import { X, User, Save } from 'lucide-react';
import { useStudentContext } from '../contexts/StudentContext';
import { useNotificationContext } from '../contexts/NotificationContext';

export const AddStudentModal = ({ onClose }) => {
  const { addStudent } = useStudentContext();
  const { addNotification } = useNotificationContext();
  const [formData, setFormData] = useState({
    name: '',
    grade: '9',
    section: 'A',
    attendance: 100,
    avgScore: 85,
    feesStatus: 'paid',
    contactEmail: 'ajay@gmail.com',
    contactPhone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate risk level
    let riskLevel = 'low';
    const riskFactors = [];
    
    if (formData.attendance < 75) {
      riskLevel = 'high';
      riskFactors.push('Poor attendance record');
    } else if (formData.attendance < 85) {
      riskLevel = 'medium';
      riskFactors.push('Declining attendance');
    }
    
    if (formData.avgScore < 60) {
      riskLevel = 'high';
      riskFactors.push('Low academic performance');
    } else if (formData.avgScore < 75) {
      if (riskLevel !== 'high') riskLevel = 'medium';
      riskFactors.push('Declining grades');
    }
    
    if (formData.feesStatus === 'overdue') {
      riskLevel = 'high';
      riskFactors.push('Overdue fee payments');
    } else if (formData.feesStatus === 'due') {
      if (riskLevel !== 'high') riskLevel = 'medium';
      riskFactors.push('Pending fee payment');
    }

    const studentData = {
      ...formData,
      riskLevel,
      riskFactors,
      attendance: parseInt(formData.attendance),
      avgScore: parseInt(formData.avgScore)
    };

    addStudent(studentData);
    addNotification({
      type: 'success',
      title: 'Student Added',
      message: `${formData.name} has been added successfully.`
    });
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Add New Student</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendance (%)</label>
              <input
                type="number"
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Average Score (%)</label>
              <input
                type="number"
                name="avgScore"
                value={formData.avgScore}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fee Status</label>
              <select
                name="feesStatus"
                value={formData.feesStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="paid">Paid</option>
                <option value="due">Due</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Add Student</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};