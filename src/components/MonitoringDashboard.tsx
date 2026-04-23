import { useState, useEffect } from 'react';
import { Server, Cpu, HardDrive, Box } from 'lucide-react';
import { API_BASE_URL } from '../api/client';

interface NodeResource {
  [key: string]: number;
}

interface NodeState {
  node_id: string;
  node_name: string;
  alive: boolean;
  resources: NodeResource;
  remaining: NodeResource;
}

export function MonitoringDashboard() {
  const [nodes, setNodes] = useState<NodeState[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Construct ws url
    const wsUrl = new URL(API_BASE_URL);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl.pathname = '/api/v1/cluster/ws/state';

    let ws: WebSocket;
    let reconnectTimer: number;

    const connect = () => {
      ws = new WebSocket(wsUrl.toString());

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setNodes(data);
        } catch (err) {
          console.error("Failed to parse cluster state", err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Try to reconnect
        reconnectTimer = window.setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error", err);
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const totalCPU = nodes.reduce((acc, node) => acc + (node.resources.CPU || 0), 0);
  const totalGPU = nodes.reduce((acc, node) => acc + (node.resources.GPU || 0), 0);
  const totalMemory = nodes.reduce((acc, node) => acc + (node.resources.memory || 0), 0);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-white shadow-sm z-10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Ray Cluster Monitoring</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time resource utilization across all nodes.</p>
        </div>
        <div className="flex items-center space-x-2">
           <span className={`flex h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
           <span className="text-sm font-medium text-slate-600">{isConnected ? 'Connected' : 'Disconnected'}</span>
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
               <p className="text-2xl font-bold text-slate-800">{nodes.length}</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
             <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mr-4">
               <Cpu size={24} className="text-indigo-600" />
             </div>
             <div>
               <p className="text-xs text-slate-500 font-medium">TOTAL CPU CORES</p>
               <p className="text-2xl font-bold text-slate-800">{totalCPU.toFixed(1)}</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
             <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mr-4">
               <HardDrive size={24} className="text-green-600" />
             </div>
             <div>
               <p className="text-xs text-slate-500 font-medium">TOTAL MEMORY</p>
               <p className="text-2xl font-bold text-slate-800">{(totalMemory / (1024 ** 3)).toFixed(2)} GB</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
             <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mr-4">
               <Box size={24} className="text-purple-600" />
             </div>
             <div>
               <p className="text-xs text-slate-500 font-medium">TOTAL GPUS</p>
               <p className="text-2xl font-bold text-slate-800">{totalGPU}</p>
             </div>
          </div>
        </div>

        {/* Node List */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
           <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Node ID</th>
                <th className="px-6 py-4 font-medium">IP</th>
                <th className="px-6 py-4 font-medium">CPU (Used / Total)</th>
                <th className="px-6 py-4 font-medium">RAM (Used / Total)</th>
                <th className="px-6 py-4 font-medium">GPU (Used / Total)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {nodes.map((node, i) => {
                const totalC = node.resources.CPU || 0;
                const remC = node.remaining.CPU || 0;
                const usedC = totalC - remC;
                const cpuPct = totalC > 0 ? (usedC / totalC) * 100 : 0;

                const totalM = node.resources.memory || 0;
                const remM = node.remaining.memory || 0;
                const usedM = totalM - remM;
                const ramPct = totalM > 0 ? (usedM / totalM) * 100 : 0;

                const totalG = node.resources.GPU || 0;
                const remG = node.remaining.GPU || 0;
                const usedG = totalG - remG;
                const gpuPct = totalG > 0 ? (usedG / totalG) * 100 : 0;

                return (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${node.alive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {node.node_id.substring(0, 12)}...
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {node.node_name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                         <span className="w-20 mr-2 text-xs text-slate-500">{usedC.toFixed(1)} / {totalC.toFixed(1)}</span>
                         <div className="w-16 bg-slate-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${cpuPct > 80 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${cpuPct}%` }}></div></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                         <span className="w-24 mr-2 text-xs text-slate-500 font-mono">{(usedM / (1024 ** 3)).toFixed(1)}G / {(totalM / (1024 ** 3)).toFixed(1)}G</span>
                         <div className="w-16 bg-slate-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${ramPct > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${ramPct}%` }}></div></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {totalG > 0 ? (
                        <div className="flex items-center">
                           <span className="w-10 mr-2 text-xs text-slate-500">{usedG.toFixed(1)} / {totalG.toFixed(1)}</span>
                           <div className="w-16 bg-slate-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${gpuPct > 80 ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${gpuPct}%` }}></div></div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">No GPU</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {nodes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    {isConnected ? 'No nodes available.' : 'Connecting...'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
