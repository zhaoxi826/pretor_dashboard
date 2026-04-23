import { useState } from 'react';
import {
  Settings, Cpu, HardDrive, List, MessageSquare, Terminal, ChevronRight,
  Activity, Server, Box, MessageCircle, Users, Key, Sliders,
  MonitorPlay, LogOut
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { LoginModal } from './components/LoginModal';
import { UsersSettings } from './components/settings/UsersSettings';
import { ProvidersSettings } from './components/settings/ProvidersSettings';
import { WorkerAgentsList } from './components/WorkerAgentsList';
import { MonitoringDashboard } from './components/MonitoringDashboard';
import { ResourcesSettings } from './components/settings/ResourcesSettings';
import { SystemSettings } from './components/settings/SystemSettings';

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('workflows');
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'settings', or 'monitoring'
  const [settingsTab, setSettingsTab] = useState('users'); // 'users', 'providers', 'resources', 'system'

  if (!isAuthenticated) {
    return <LoginModal onSuccess={login} />;
  }

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">

      {/* 1. Sidebar (Leftmost) - Plugins */}
      <div className="w-12 bg-white border-r border-slate-200 flex flex-col items-center py-4 space-y-6 shadow-sm z-10 shrink-0">
        <div
          className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200 cursor-pointer hover:bg-blue-700 transition-colors"
          onClick={() => setCurrentView('dashboard')}
        >
          <Activity size={18} />
        </div>

        <div className="flex flex-col space-y-4 flex-1 mt-8">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`p-1.5 rounded-lg transition-colors ${currentView === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'}`}
            title="Dashboard"
          >
            <MessageSquare size={18} />
          </button>
          <button
            onClick={() => setCurrentView('monitoring')}
            className={`p-1.5 rounded-lg transition-colors ${currentView === 'monitoring' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'}`}
            title="Monitoring"
          >
            <MonitorPlay size={18} />
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            className={`p-1.5 rounded-lg transition-colors ${currentView === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'}`}
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {currentView === 'monitoring' ? (
        <MonitoringDashboard />
      ) : currentView === 'dashboard' ? (
        <>
          {/* 2. Left Panel - Cluster Status & Workflows/Chats */}
          <div className="w-72 bg-white border-r border-slate-200 flex flex-col z-0 shrink-0">

            {/* Top: Cluster Status */}
            <div className="h-1/3 p-4 border-b border-slate-100 flex flex-col">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                <Server size={16} className="mr-2" />
                Cluster Status
              </h2>
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-slate-600">
                    <Box size={16} className="mr-2 text-blue-500" />
                    <span className="text-sm">Active Nodes</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">3 / 4</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-slate-600">
                    <Cpu size={16} className="mr-2 text-indigo-500" />
                    <span className="text-sm">Cluster CPU</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">45%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-slate-600">
                    <HardDrive size={16} className="mr-2 text-green-500" />
                    <span className="text-sm">Cluster RAM</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">12.4 GB</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>

            {/* Bottom: Tabs for Workflows & Basic Chats */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => setActiveTab('workflows')}
                  className={`flex-1 py-3 text-xs font-medium text-center uppercase tracking-wider transition-colors ${activeTab === 'workflows' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <List size={14} className="inline mr-1.5 -mt-0.5" />
                  Workflows
                </button>
                <button
                  onClick={() => setActiveTab('chats')}
                  className={`flex-1 py-3 text-xs font-medium text-center uppercase tracking-wider transition-colors ${activeTab === 'chats' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <MessageCircle size={14} className="inline mr-1.5 -mt-0.5" />
                  Chats
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                {activeTab === 'workflows' && (
                  <WorkerAgentsList />
                )}
                {activeTab === 'chats' && (
                  <div className="space-y-2">
                    <div className="text-xs text-slate-400 p-2 text-center border border-dashed border-slate-200 rounded">
                      Basic chats coming soon...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Middle Panel - AI Chat */}
          <div className="flex-1 flex flex-col bg-slate-50">
            <div className="h-14 border-b border-slate-200 bg-white flex items-center px-6 shadow-sm z-10">
              <MessageSquare size={18} className="text-blue-600 mr-3" />
              <h1 className="font-semibold text-slate-800">Pretor Assistant</h1>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* System Message */}
              <div className="flex justify-center">
                <span className="text-xs text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full">Today 10:42 AM</span>
              </div>

              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                  <p className="text-sm leading-relaxed">Start the data processing workflow for yesterday's logs.</p>
                </div>
              </div>

              {/* AI Message */}
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-white border border-blue-100 flex items-center justify-center mr-3 mt-1 shadow-sm flex-shrink-0">
                  <Activity size={16} className="text-blue-600" />
                </div>
                <div className="bg-white border border-slate-100 text-slate-700 p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                  <p className="text-sm leading-relaxed mb-3">I've initiated the <strong>Data Processing 1</strong> workflow. It is currently gathering logs.</p>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center text-sm">
                    <Terminal size={16} className="text-slate-400 mr-2" />
                    <span className="font-mono text-slate-600 text-xs">Task ID: flow_x829j_log</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask Pretor to do something..."
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
                />
                <button className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="flex mt-2 space-x-3 px-2">
                <span className="text-[10px] text-slate-400 cursor-pointer hover:text-blue-500">Run diagnostics</span>
                <span className="text-[10px] text-slate-400 cursor-pointer hover:text-blue-500">View recent errors</span>
              </div>
            </div>
          </div>

          {/* 4. Right Panel - Workflow Execution Status */}
          <div className="w-80 bg-white border-l border-slate-200 flex flex-col z-0">
            <div className="h-14 border-b border-slate-100 flex items-center px-4 justify-between bg-slate-50/50">
              <h2 className="font-semibold text-slate-800 text-sm flex items-center">
                <Terminal size={16} className="mr-2 text-slate-500" />
                Execution Trace
              </h2>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium border border-green-200">Running</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Data Processing 1</h3>
                <p className="text-xs text-slate-500 mb-4 font-mono">ID: flow_x829j_log</p>

                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-xs text-slate-600 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Started:</span>
                    <span>2 mins ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Agent:</span>
                    <span className="font-medium text-blue-600">Supervisor Node</span>
                  </div>
                </div>
              </div>

              {/* Vertical Timeline Container */}
              <div className="relative border-l-2 border-slate-200 ml-3 pl-6 space-y-6">

                {/* Step 1 */}
                <div className="relative">
                  {/* Dot */}
                  <div className="absolute -left-[31px] top-1 flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-green-500 text-white shadow-sm">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  {/* Card */}
                  <div className="p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                      <h4 className="font-semibold text-slate-800 text-xs mb-1">1. Initialize Context</h4>
                      <p className="text-[11px] text-slate-500">Loaded environment variables and db connection.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  {/* Dot (Active) */}
                  <div className="absolute -left-[31px] top-1 flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-blue-500 shadow-sm">
                      <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
                  </div>
                  {/* Card */}
                  <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 shadow-sm">
                      <h4 className="font-semibold text-blue-800 text-xs mb-1">2. Consciousness Node</h4>
                      <p className="text-[11px] text-blue-600">Planning data extraction steps...</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative opacity-60">
                  {/* Dot (Pending) */}
                  <div className="absolute -left-[31px] top-1 flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-slate-200 shadow-sm"></div>
                  {/* Card */}
                  <div className="p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                      <h4 className="font-semibold text-slate-600 text-xs mb-1">3. Control Node Exec</h4>
                      <p className="text-[11px] text-slate-500">Waiting to execute tasks.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>
      ) : (
        /* Settings View */
        <div className="flex-1 flex bg-slate-50 overflow-hidden">
           {/* Settings Inner Sidebar */}
           <div className="w-64 bg-white border-r border-slate-200 flex flex-col z-0">
              <div className="p-6 border-b border-slate-100">
                 <h2 className="text-lg font-semibold text-slate-800">Settings</h2>
              </div>
              <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                 <button
                   onClick={() => setSettingsTab('users')}
                   className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${settingsTab === 'users' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                 >
                   <Users size={18} className="mr-3" />
                   User Management
                 </button>
                 <button
                   onClick={() => setSettingsTab('providers')}
                   className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${settingsTab === 'providers' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                 >
                   <Key size={18} className="mr-3" />
                   Provider Management
                 </button>
                 <button
                   onClick={() => setSettingsTab('resources')}
                   className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${settingsTab === 'resources' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                 >
                   <Box size={18} className="mr-3" />
                   Resources
                 </button>
                 <button
                   onClick={() => setSettingsTab('system')}
                   className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${settingsTab === 'system' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                 >
                   <Sliders size={18} className="mr-3" />
                   System Settings
                 </button>
              </div>
           </div>

           {/* Settings Main Content */}
           <div className="flex-1 overflow-y-auto p-8">
              {settingsTab === 'users' && <UsersSettings />}
              {settingsTab === 'providers' && <ProvidersSettings />}
              {settingsTab === 'resources' && <ResourcesSettings />}
              {settingsTab === 'system' && <SystemSettings />}
           </div>
        </div>
      )}

    </div>
  );
}

export default App;