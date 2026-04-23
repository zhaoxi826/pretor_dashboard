
import { Globe, Server, Save } from 'lucide-react';

export function SystemSettings() {
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
