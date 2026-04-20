import { useState } from 'react';

import { Sidebar } from './components/Layout/Sidebar';
import { MonitoringDashboard } from './components/Monitoring/MonitoringDashboard';
import { SettingsLayout } from './components/Settings/SettingsLayout';
import { LeftPanel } from './components/Chat/LeftPanel';
import { ChatPanel } from './components/Chat/ChatPanel';
import { RightPanel } from './components/Chat/RightPanel';


function App() {
  const [activeTab, setActiveTab] = useState('workflows'); // For LeftPanel
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'settings', or 'monitoring'
  const [settingsTab, setSettingsTab] = useState('users'); // For SettingsLayout

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">

      {/* 1. Sidebar (Leftmost) */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area depending on view */}
      {currentView === 'monitoring' ? (
        <MonitoringDashboard />
      ) : currentView === 'dashboard' ? (
        <>
          {/* 2. Left Panel - Cluster Status & Workflows/Chats */}
          <LeftPanel activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* 3. Middle Panel - AI Chat */}
          <ChatPanel />

          {/* 4. Right Panel - Workflow Execution Status */}
          <RightPanel />
        </>
      ) : (
        /* Settings View */
        <SettingsLayout settingsTab={settingsTab} setSettingsTab={setSettingsTab} />
      )}

    </div>
  );
}

export default App;
