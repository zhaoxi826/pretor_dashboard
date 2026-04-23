import React, { useState } from 'react';
import {
  Settings, Cpu, HardDrive, Network, List, MessageSquare, Terminal, ChevronRight,
  Activity, Zap, Server, Box, MessageCircle, Users, Key, Sliders, Plus, Edit2,
  Trash2, Globe, Save, MonitorPlay
} from 'lucide-react';

function UsersSettings() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">User Management</h3>
          <p className="text-sm text-slate-500 mt-1">Manage system users and their roles.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm">
          <Plus size={16} className="mr-2" />
          Add User
        </button>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Username</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'admin', role: 'Administrator', status: 'Active' },
              { name: 'zhaoxi', role: 'User', status: 'Active' },
              { name: 'guest', role: 'Viewer', status: 'Inactive' },
            ].map((user, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                <td className="px-6 py-4 text-slate-600">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-blue-600 mr-3 transition-colors" title="Edit"><Edit2 size={16} /></button>
                  <button className="text-slate-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProvidersSettings() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">Provider Management</h3>
          <p className="text-sm text-slate-500 mt-1">Configure external AI model providers and API keys.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm">
          <Plus size={16} className="mr-2" />
          Add Provider
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[
          { name: 'OpenAI', type: 'API', status: 'Connected', model: 'gpt-4o' },
          { name: 'Local vLLM', type: 'Local', status: 'Connected', model: 'llama-3-8b-instruct' },
          { name: 'Anthropic', type: 'API', status: 'Not Configured', model: 'claude-3-5-sonnet' },
        ].map((provider, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-blue-200 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mr-3">
                  <Box size={20} className="text-slate-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{provider.name}</h4>
                  <span className="text-xs text-slate-500 font-mono">{provider.type}</span>
                </div>
              </div>
              <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-md border ${provider.status === 'Connected' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                {provider.status === 'Connected' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>}
                {provider.status}
              </span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-1">Default Model:</p>
              <div className="bg-slate-50 border border-slate-100 rounded text-sm px-3 py-1.5 font-mono text-slate-700">{provider.model}</div>
            </div>
            <div className="flex justify-end space-x-2">
               <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Configure</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemSettings() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-800">System Settings</h3>
        <p className="text-sm text-slate-500 mt-1">Global platform configurations.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
            <Globe size={16} className="mr-2 text-slate-500" />
            General
          </h4>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">System Language</label>
              <select className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                <option>English</option>
                <option>简体中文</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Theme</label>
              <select className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                <option>Light</option>
                <option>Dark</option>
                <option>System Default</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
            <Server size={16} className="mr-2 text-slate-500" />
            Cluster & Runtime
          </h4>
          <div className="space-y-4 max-w-md">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Concurrent Workflows</label>
              <input type="number" defaultValue={10} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
             <div className="flex items-center mt-4">
              <input type="checkbox" id="debug_mode" defaultChecked className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
              <label htmlFor="debug_mode" className="ml-2 block text-sm text-slate-700">
                Enable debug logging
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm">
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function MonitoringDashboard() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-white shadow-sm z-10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Ray Cluster Monitoring</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time resource utilization across all nodes.</p>
        </div>
        <div className="flex items-center space-x-2">
           <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
           <span className="text-sm font-medium text-slate-600">Connected</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Cluster Global Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
             <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
               <Server size={24} className="text-blue-600" />
             </div>
             <div>
               <p className="text-xs text-slate-500 font-medium">TOTAL NODES</p>
               <p className="text-2xl font-bold text-slate-800">4</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
             <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mr-4">
               <Cpu size={24} className="text-indigo-600" />
             </div>
             <div>
               <p className="text-xs text-slate-500 font-medium">TOTAL CPU CORES</p>
               <p className="text-2xl font-bold text-slate-800">128</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
             <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mr-4">
               <HardDrive size={24} className="text-green-600" />
             </div>
             <div>
               <p className="text-xs text-slate-500 font-medium">TOTAL RAM</p>
               <p className="text-2xl font-bold text-slate-800">512 GB</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
             <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mr-4">
               <Box size={24} className="text-purple-600" />
             </div>
             <div>
               <p className="text-xs text-slate-500 font-medium">TOTAL GPUS</p>
               <p className="text-2xl font-bold text-slate-800">8</p>
             </div>
          </div>
        </div>

        {/* Node List */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
           <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Node IP</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">CPU</th>
                <th className="px-6 py-4 font-medium">RAM</th>
                <th className="px-6 py-4 font-medium">GPU</th>
                <th className="px-6 py-4 font-medium">VRAM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { ip: '192.168.0.2', role: 'Head', cpu: '24%', ram: '16GB / 64GB', gpu: 'N/A', vram: 'N/A', status: 'healthy' },
                { ip: '192.168.0.3', role: 'Worker', cpu: '85%', ram: '112GB / 128GB', gpu: '98%', vram: '22GB / 24GB', status: 'busy' },
                { ip: '192.168.0.4', role: 'Worker', cpu: '12%', ram: '32GB / 128GB', gpu: '0%', vram: '0GB / 24GB', status: 'healthy' },
                { ip: '192.168.0.5', role: 'Worker', cpu: '45%', ram: '64GB / 128GB', gpu: '40%', vram: '12GB / 24GB', status: 'healthy' },
              ].map((node, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${node.status === 'busy' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                    {node.ip}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${node.role === 'Head' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                      {node.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                       <span className="w-10 text-right mr-2">{node.cpu}</span>
                       <div className="w-16 bg-slate-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${parseInt(node.cpu) > 80 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: node.cpu }}></div></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">{node.ram}</td>
                  <td className="px-6 py-4">
                    {node.gpu !== 'N/A' ? (
                      <div className="flex items-center">
                         <span className="w-10 text-right mr-2">{node.gpu}</span>
                         <div className="w-16 bg-slate-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${parseInt(node.gpu) > 80 ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: node.gpu }}></div></div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No GPU</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">{node.vram}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('workflows');
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'settings', or 'monitoring'
  const [settingsTab, setSettingsTab] = useState('users'); // 'users', 'providers', 'system'

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
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`p-3 rounded-lg border cursor-pointer transition-all ${i === 1 ? 'border-blue-200 bg-blue-50 shadow-sm' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-medium text-sm ${i === 1 ? 'text-blue-700' : 'text-slate-700'}`}>Data Processing {i}</span>
                          <span className={`flex h-2 w-2 rounded-full ${i === 1 ? 'bg-green-400' : 'bg-slate-300'}`}></span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">Processing raw user logs...</p>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'chats' && (
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-slate-50 cursor-pointer transition-all">
                      <div className="font-medium text-sm text-slate-700 mb-1">System Architecture</div>
                      <p className="text-xs text-slate-400 line-clamp-1">Can you explain the MoE model...</p>
                        App;            </div>
                    <div className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-slate-50 cursor-pointer transition-all">
                      <div className="font-medium text-sm text-slate-700 mb-1">Log Analysis Helper</div>
                      <p className="text-xs text-slate-400 line-clamp-1">Show me the errors from yesterday.</p>
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
              {settingsTab === 'system' && <SystemSettings />}
           </div>
        </div>
      )}

    </div>
  );
}

export default