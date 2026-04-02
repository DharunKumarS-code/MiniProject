import React from 'react';
import { BarChart3, Upload, Settings, FileText, Brain, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navigation = ({ activeTab, onTabChange }) => {
  const { isAdmin } = useAuth();
  
  const adminTabs = [
    { id: 'admin', label: 'Admin Panel', icon: Shield },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'import', label: 'Data Import', icon: Upload },
    { id: 'ai-features', label: 'AI Features', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  const teacherTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'import', label: 'Data Import', icon: Upload },
    { id: 'ai-features', label: 'AI Features', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  const tabs = isAdmin ? adminTabs : teacherTabs;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};