import React, { useState } from 'react';
import { StatsOverview } from './dashboard/StatsOverview';
import { RiskFilters } from './dashboard/RiskFilters';
import { StudentGrid } from './dashboard/StudentGrid';
import { TrendAnalysis } from './dashboard/TrendAnalysis';
import { AddStudentModal } from './AddStudentModal';
import { useStudentContext } from '../contexts/StudentContext';
import { Plus } from 'lucide-react';

export const Dashboard = () => {
  const { students, filters, setFilters } = useStudentContext();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Student Risk Dashboard</h2>
          <p className="text-gray-600">Monitor student engagement and identify early warning signs</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <StatsOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <RiskFilters filters={filters} onFiltersChange={setFilters} />
        </div>
        <div className="lg:col-span-3">
          <StudentGrid />
        </div>
      </div>

      <TrendAnalysis />
      
      {showAddModal && (
        <AddStudentModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};