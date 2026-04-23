
import { Users, Key, Sliders } from 'lucide-react';
import { UsersSettings } from './UsersSettings';
import { ProvidersSettings } from './ProvidersSettings';
import { SystemSettings } from './SystemSettings';

interface SettingsLayoutProps {
  settingsTab: string;
  setSettingsTab: (tab: string) => void;
}

export function SettingsLayout({ settingsTab, setSettingsTab }: SettingsLayoutProps) {
  return (
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
  );
}
