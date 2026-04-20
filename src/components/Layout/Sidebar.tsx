
import { Activity, MessageSquare, MonitorPlay, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  return (
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
  );
}
