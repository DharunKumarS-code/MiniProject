import React from 'react';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';
import { useStudentContext } from '../../contexts/StudentContext';

export const TrendAnalysis = () => {
  const { students } = useStudentContext();

  const trends = [
    {
      title: 'Weekly Attendance Trend',
      value: '+2.3%',
      description: 'Improvement from last week',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Average Score Trend',
      value: '-1.5%',
      description: 'Decline in average scores',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Risk Predictions',
      value: '15 students',
      description: 'May need support next month',
      icon: Target,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Early Interventions',
      value: '8 completed',
      description: 'Successful interventions this month',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Trend Analysis & ML Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {trends.map((trend) => {
          const IconComponent = trend.icon;
          return (
            <div key={trend.title} className="text-center">
              <div className={`${trend.bgColor} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <IconComponent className={`h-6 w-6 ${trend.color}`} />
              </div>
              <div className={`text-xl font-bold ${trend.color}`}>{trend.value}</div>
              <div className="text-sm font-medium text-gray-900 mb-1">{trend.title}</div>
              <div className="text-xs text-gray-600">{trend.description}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Risk Distribution Trends</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">High Risk Students</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/3 h-2 bg-red-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-red-600">33%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Watch List</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-yellow-600">50%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">On Track</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="w-2/3 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-green-600">67%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Predictive Insights</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span className="text-gray-700">Students with declining attendance show 65% correlation with grade drops</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span className="text-gray-700">Fee payment delays predict 40% higher dropout risk</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span className="text-gray-700">Early intervention improves outcomes by 78% on average</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};