import React, { useState } from 'react';
import { StudentCard } from './StudentCard';
import { StudentModal } from './StudentModal';
import { useStudentContext } from '../../contexts/StudentContext';

export const StudentGrid = () => {
  const { filteredStudents, students } = useStudentContext();
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Students ({filteredStudents.length})
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>High Risk</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Watch</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>On Track</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={() => setSelectedStudent(student)}
            />
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            {students.length === 0 ? (
              <div>
                <p className="text-gray-500 mb-4">No students have been imported yet.</p>
                <p className="text-sm text-gray-400">Use the Data Import tab to upload student information.</p>
              </div>
            ) : (
              <p className="text-gray-500">No students match the current filters.</p>
            )}
          </div>
        )}
      </div>

      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
};