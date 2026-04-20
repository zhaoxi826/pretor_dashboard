import { useState } from 'react';
import { Server } from 'lucide-react';
import { MonitoringDashboard } from './MonitoringDashboard';

export function MonitoringLayout() {
  const [activeTab, setActiveTab] = useState('cluster');

  return (
    <div className="flex-1 flex bg-slate-50 overflow-hidden">
       {/* Monitoring Inner Sidebar */}
       <div className="w-64 bg-white border-r border-slate-200 flex flex-col z-0">
          <div className="p-6 border-b border-slate-100">
             <h2 className="text-lg font-semibold text-slate-800">Monitoring</h2>
          </div>
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
             <button
               onClick={() => setActiveTab('cluster')}
               className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'cluster' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
             >
               <Server size={18} className="mr-3" />
               Cluster Monitor
             </button>
             {/* Future monitoring tabs (e.g., Application Logs, Agent Metrics) can go here */}
          </div>
       </div>

       {/* Monitoring Main Content */}
       <div className="flex-1 overflow-y-auto">
          {activeTab === 'cluster' && <MonitoringDashboard />}
       </div>
    </div>
  );
}
