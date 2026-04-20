
import { Terminal } from 'lucide-react';

export function RightPanel() {
  return (
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
  );
}
