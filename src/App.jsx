import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { DataImport } from './components/DataImport';
import { Settings } from './components/Settings';
import { Reports } from './components/Reports';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AdminDashboard } from './components/AdminDashboard';
import { AIFeatures } from './components/AIFeatures';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { StudentProvider } from './contexts/StudentContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState(isAdmin ? 'admin' : 'dashboard');
  const [showRegister, setShowRegister] = useState(false);

  const renderContent = () => {
    if (isAdmin) {
      switch (activeTab) {
        case 'admin': return <AdminDashboard />;
        case 'dashboard': return <Dashboard />;
        case 'import': return <DataImport />;
        case 'ai-features': return <AIFeatures />;
        case 'analytics': return <AdvancedAnalytics />;
        case 'reports': return <Reports />;
        case 'settings': return <Settings />;
        default: return <AdminDashboard />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard': return <Dashboard />;
        case 'import': return <DataImport />;
        case 'ai-features': return <AIFeatures />;
        case 'analytics': return <AdvancedAnalytics />;
        case 'reports': return <Reports />;
        case 'settings': return <Settings />;
        default: return <Dashboard />;
      }
    }
  };

  if (!isAuthenticated) {
    return showRegister ? (
      <Register onToggleLogin={() => setShowRegister(false)} />
    ) : (
      <Login onToggleRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <StudentProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="container mx-auto px-4 py-6">
            {renderContent()}
          </main>
        </div>
      </NotificationProvider>
    </StudentProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
