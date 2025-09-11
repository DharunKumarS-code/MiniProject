import React, { useState } from 'react';
import { GraduationCap, Bell, Settings, User, LogOut } from 'lucide-react';
import { useNotificationContext } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationContext();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EduWatch</h1>
              <p className="text-sm text-gray-600">Student Risk Monitoring Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell 
                className="h-6 w-6 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors" 
                onClick={() => setShowNotifications(!showNotifications)}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
              
              {showNotifications && (
                <div className="absolute right-0 top-8 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'error' ? 'bg-red-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                              <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                              <p className="text-gray-400 text-xs mt-1">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <div 
                className="flex items-center space-x-2 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg p-2"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-600">
                    {user?.role === 'admin' ? 'Administrator' : `${user?.department} Teacher`}
                  </p>
                </div>
              </div>
              
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};