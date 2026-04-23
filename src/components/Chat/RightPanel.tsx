import { useState, useEffect } from 'react';
import { Terminal, Activity } from 'lucide-react';

interface RightPanelProps {
  selectedWorkflow: string | null;
}

export function RightPanel({ selectedWorkflow }: RightPanelProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!selectedWorkflow) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([]);
      return;
    }

    const wsBase = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace('http', 'ws')
      : `ws://localhost:8000`;

    // Using the workflow router WS endpoint
    const ws = new WebSocket(`${wsBase}/api/v1/workflow/ws/${selectedWorkflow}`);

    ws.onopen = () => {
      setIsConnected(true);

      setMessages([]); // clear previous traces
    };

    ws.onmessage = (event) => {
      try {
        setMessages(prev => [...prev, event.data]);
      } catch (e) {
        console.error("Error receiving workflow websocket message", e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [selectedWorkflow]);

  if (!selectedWorkflow) {
    return (
      <div className="w-80 bg-white border-l border-slate-200 flex flex-col z-0 justify-center items-center p-6 text-center">
         <Activity size={32} className="text-slate-300 mb-4" />
         <h3 className="text-sm font-semibold text-slate-600">No Workflow Selected</h3>
         <p className="text-xs text-slate-400 mt-2">Select a workflow from the left panel to view its execution trace.</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col z-0">
      <div className="h-14 border-b border-slate-100 flex items-center px-4 justify-between bg-slate-50/50">
        <h2 className="font-semibold text-slate-800 text-sm flex items-center">
          <Terminal size={16} className="mr-2 text-slate-500" />
          Execution Trace
        </h2>
        <span className={`px-2 py-1 text-xs rounded-md font-medium border ${isConnected ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
          {isConnected ? 'Running' : 'Disconnected'}
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 mb-1">Workflow Logs</h3>
          <p className="text-xs text-slate-500 mb-4 font-mono">ID: {selectedWorkflow}</p>
        </div>

        {/* Dynamic Log Rendering */}
        <div className="relative border-l-2 border-slate-200 ml-3 pl-6 space-y-6">

          {messages.length === 0 && isConnected && (
             <div className="text-xs text-slate-400 italic">Waiting for workflow events...</div>
          )}

          {messages.map((msg, idx) => {
             // For now, simply parsing the raw text as a basic log entry.
             // If the backend sends structured JSON, this could be parsed and styled nicer.
             const isLatest = idx === messages.length - 1;

             return (
              <div key={idx} className="relative">
                {/* Dot */}
                <div className={`absolute -left-[31px] top-1 flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow-sm ${isLatest && isConnected ? 'bg-blue-500' : 'bg-green-500 text-white'}`}>
                    {isLatest && isConnected ? (
                      <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
                    ) : (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    )}
                </div>
                {/* Card */}
                <div className={`p-3 rounded-lg border shadow-sm ${isLatest && isConnected ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-white'}`}>
                    <h4 className={`font-semibold text-xs mb-1 ${isLatest && isConnected ? 'text-blue-800' : 'text-slate-800'}`}>Step {idx + 1}</h4>
                    <p className={`text-[11px] font-mono break-all ${isLatest && isConnected ? 'text-blue-600' : 'text-slate-500'}`}>{msg}</p>
                </div>
              </div>
             )
          })}
        </div>
      </div>
    </div>
  );
}
