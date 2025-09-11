import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Edit, Trash2, Plus, Mail, BookOpen, Building } from 'lucide-react';

export const AdminDashboard = () => {
  const { getAllTeachers, updateTeacher, deleteTeacher } = useAuth();
  const [teachers, setTeachers] = useState(getAllTeachers());
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleUpdateTeacher = (teacherId, updates) => {
    if (updateTeacher(teacherId, updates)) {
      setTeachers(getAllTeachers());
      setEditingTeacher(null);
    }
  };

  const handleDeleteTeacher = (teacherId) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      if (deleteTeacher(teacherId)) {
        setTeachers(getAllTeachers());
      }
    }
  };

  const TeacherForm = ({ teacher, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: teacher?.name || '',
      email: teacher?.email || '',
      department: teacher?.department || '',
      subjects: teacher?.subjects?.join(', ') || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const updatedData = {
        ...formData,
        subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s)
      };
      onSave(teacher?.id, updatedData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {teacher ? 'Edit Teacher' : 'Add Teacher'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subjects</label>
              <input
                type="text"
                required
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                placeholder="Comma separated subjects"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600">Manage teachers and system settings</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Teacher</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(teachers.map(t => t.department)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Subjects</p>
              <p className="text-2xl font-bold text-gray-900">
                {teachers.reduce((acc, t) => acc + (t.subjects?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Teachers Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {teacher.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{teacher.department}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects?.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingTeacher(teacher)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(editingTeacher || showAddForm) && (
        <TeacherForm
          teacher={editingTeacher}
          onSave={handleUpdateTeacher}
          onCancel={() => {
            setEditingTeacher(null);
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
};