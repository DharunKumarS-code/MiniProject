import React from 'react';
import { Users, AlertTriangle, TrendingDown, CheckCircle } from 'lucide-react';
import { useStudentContext } from '../../contexts/StudentContext';

export const StatsOverview = () => {
  const { students } = useStudentContext();
  
  const totalStudents = students.length;
  const highRiskCount = students.filter(s => s.riskLevel === 'high').length;
  const mediumRiskCount = students.filter(s => s.riskLevel === 'medium').length;
  const lowRiskCount = students.filter(s => s.riskLevel === 'low').length;

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: 'High Risk',
      value: highRiskCount,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      change: '+12% from last week',
    },
    {
      title: 'Watch List',
      value: mediumRiskCount,
      icon: TrendingDown,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      title: 'On Track',
      value: lowRiskCount,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div key={stat.title} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                {stat.change && (
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};