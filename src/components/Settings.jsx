import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, AlertTriangle, Bell, Users, Target } from 'lucide-react';
import { useStudentContext } from '../contexts/StudentContext';
import { useNotificationContext } from '../contexts/NotificationContext';

export const Settings = () => {
  const { riskThresholds, updateRiskThresholds } = useStudentContext();
  const { addNotification } = useNotificationContext();
  const [thresholds, setThresholds] = useState(riskThresholds);
  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: true,
    smsEnabled: false,
    frequency: 'daily',
    recipients: ['teachers', 'coordinators'],
  });

  const handleThresholdChange = (category, level, value) => {
    setThresholds({
      ...thresholds,
      [category]: {
        ...thresholds[category],
        [level]: value,
      },
    });
  };

  const handleSave = () => {
    updateRiskThresholds(thresholds);
    addNotification({
      type: 'success',
      title: 'Settings Updated',
      message: 'Risk assessment thresholds have been updated successfully.'
    });
  };

  const resetToDefaults = () => {
    const defaults = {
      attendance: { high: 75, medium: 85 },
      grades: { high: 60, medium: 75 },
      fees: { overdue: 30, due: 7 },
    };
    setThresholds(defaults);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Configure risk assessment thresholds and notification preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Thresholds */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Risk Assessment Thresholds</h3>
          </div>

          <div className="space-y-6">
            {/* Attendance Thresholds */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Attendance Percentage</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <label className="flex-1 text-sm text-gray-700">High Risk (below)</label>
                  <input
                    type="number"
                    value={thresholds.attendance.high}
                    onChange={(e) => handleThresholdChange('attendance', 'high', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <label className="flex-1 text-sm text-gray-700">Watch List (below)</label>
                  <input
                    type="number"
                    value={thresholds.attendance.medium}
                    onChange={(e) => handleThresholdChange('attendance', 'medium', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
            </div>

            {/* Grade Thresholds */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Average Grade Percentage</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <label className="flex-1 text-sm text-gray-700">High Risk (below)</label>
                  <input
                    type="number"
                    value={thresholds.grades.high}
                    onChange={(e) => handleThresholdChange('grades', 'high', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <label className="flex-1 text-sm text-gray-700">Watch List (below)</label>
                  <input
                    type="number"
                    value={thresholds.grades.medium}
                    onChange={(e) => handleThresholdChange('grades', 'medium', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
            </div>

            {/* Fee Thresholds */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Fee Payment (Days)</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <label className="flex-1 text-sm text-gray-700">Overdue (after)</label>
                  <input
                    type="number"
                    value={thresholds.fees.overdue}
                    onChange={(e) => handleThresholdChange('fees', 'overdue', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">days</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <label className="flex-1 text-sm text-gray-700">Due Soon (within)</label>
                  <input
                    type="number"
                    value={thresholds.fees.due}
                    onChange={(e) => handleThresholdChange('fees', 'due', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={resetToDefaults}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Notification Methods</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailEnabled}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      emailEnabled: e.target.checked
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsEnabled}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      smsEnabled: e.target.checked
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">SMS Notifications</span>
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Notification Frequency</h4>
              <select
                value={notificationSettings.frequency}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  frequency: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Summary</option>
                <option value="weekly">Weekly Report</option>
              </select>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Recipients</h4>
              <div className="space-y-3">
                {['teachers', 'coordinators', 'principals', 'parents'].map((recipient) => (
                  <label key={recipient} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.recipients.includes(recipient)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNotificationSettings({
                            ...notificationSettings,
                            recipients: [...notificationSettings.recipients, recipient]
                          });
                        } else {
                          setNotificationSettings({
                            ...notificationSettings,
                            recipients: notificationSettings.recipients.filter(r => r !== recipient)
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{recipient}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ML Configuration */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <AlertTriangle className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Machine Learning Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Prediction Models</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Attendance Trend Analysis</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Grade Performance Prediction</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Dropout Risk Assessment</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Model Parameters</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Historical Data Period (months)</label>
                <input
                  type="number"
                  defaultValue="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="24"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Prediction Confidence Threshold (%)</label>
                <input
                  type="number"
                  defaultValue="75"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="50"
                  max="95"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Model Performance</h5>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Accuracy:</span>
              <span className="font-medium text-blue-900 ml-1">87%</span>
            </div>
            <div>
              <span className="text-blue-700">Precision:</span>
              <span className="font-medium text-blue-900 ml-1">84%</span>
            </div>
            <div>
              <span className="text-blue-700">Recall:</span>
              <span className="font-medium text-blue-900 ml-1">91%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};