import { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { MonitoringLayout } from './components/Monitoring/MonitoringLayout';
import { SettingsLayout } from './components/Settings/SettingsLayout';
import { LeftPanel } from './components/Chat/LeftPanel';
import { ChatPanel } from './components/Chat/ChatPanel';
import { RightPanel } from './components/Chat/RightPanel';

function App() {
  const [activeTab, setActiveTab] = useState('chats'); // For LeftPanel
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'settings', or 'monitoring'
  const [settingsTab, setSettingsTab] = useState('users'); // For SettingsLayout

  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">

      {/* 1. Sidebar (Leftmost) */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

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
