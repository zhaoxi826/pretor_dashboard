import { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { MonitoringLayout } from './components/Monitoring/MonitoringLayout';
import { SettingsLayout } from './components/Settings/SettingsLayout';
import { LeftPanel } from './components/Chat/LeftPanel';
import { ChatPanel } from './components/Chat/ChatPanel';
import { RightPanel } from './components/Chat/RightPanel';
import { AuthPage } from './components/Auth/AuthPage';

function App() {
  const [activeTab, setActiveTab] = useState('chats'); // For LeftPanel
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'settings', or 'monitoring'
  const [settingsTab, setSettingsTab] = useState('users'); // For SettingsLayout

  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  // Authentication State
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">

      {/* 1. Sidebar (Leftmost) */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} />

      {/* Main Content Area depending on view */}
      {currentView === 'monitoring' ? (
        <MonitoringLayout />
      ) : currentView === 'dashboard' ? (
        <>
          {/* 2. Left Panel - Cluster Status & Workflows/Chats */}
          <LeftPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedWorkflow={selectedWorkflow}
            setSelectedWorkflow={setSelectedWorkflow}
          />

          {/* 3. Middle Panel - AI Chat */}
          <ChatPanel />

          {/* 4. Right Panel - Workflow Execution Status (Only show when viewing workflows) */}
          {activeTab === 'workflows' && <RightPanel selectedWorkflow={selectedWorkflow} />}
        </>
      ) : (
        /* Settings View */
        <SettingsLayout settingsTab={settingsTab} setSettingsTab={setSettingsTab} />
      )}

    </div>
  );
}

export default App;
