
import { Server, Box, Cpu, HardDrive, List, MessageCircle } from 'lucide-react';

interface LeftPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function LeftPanel({ activeTab, setActiveTab }: LeftPanelProps) {
  return (
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
              </div>
              <div className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-slate-50 cursor-pointer transition-all">
                <div className="font-medium text-sm text-slate-700 mb-1">Log Analysis Helper</div>
                <p className="text-xs text-slate-400 line-clamp-1">Show me the errors from yesterday.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
