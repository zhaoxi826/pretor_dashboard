import { useState, useEffect } from 'react';

import { Server, Cpu, HardDrive, Box } from 'lucide-react';
import type { ClusterNode } from '../../types';

export function MonitoringDashboard() {
  const [nodes, setNodes] = useState<ClusterNode[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Determine WS URL based on API base URL or window location
    const wsBase = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace('http', 'ws')
      : `ws://localhost:8000`;

    const ws = new WebSocket(`${wsBase}/api/v1/cluster/ws/state`);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          setNodes(data);
        }
      } catch (e) {
        console.error("Error parsing cluster state websocket message", e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const totalNodes = nodes.length;
  let totalCpu = 0;
  let totalMemory = 0;
  let totalGpu = 0;

  nodes.forEach(node => {
    totalCpu += node.resources?.CPU || 0;
    totalMemory += node.resources?.memory || 0;
    totalGpu += node.resources?.GPU || 0;
  });

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
               <p className="text-2xl font-bold text-slate-800">{totalNodes}</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
             <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mr-4">
               <Cpu size={24} className="text-indigo-600" />
             </div>
             <div>
               <p className="text-xs text-slate-500 font-medium">TOTAL CPU CORES</p>
               <p className="text-2xl font-bold text-slate-800">{totalCpu}</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
             <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mr-4">
               <HardDrive size={24} className="text-green-600" />
             </div>
             <div>
               <p className="text-xs text-slate-500 font-medium">TOTAL RAM</p>
               <p className="text-2xl font-bold text-slate-800">
                  {totalMemory > 0 ? `${(totalMemory / (1024 * 1024 * 1024)).toFixed(2)} GB` : '0 GB'}
               </p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
             <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mr-4">
               <Box size={24} className="text-purple-600" />
             </div>
             <div>
               <p className="text-xs text-slate-500 font-medium">TOTAL GPUS</p>
               <p className="text-2xl font-bold text-slate-800">{totalGpu}</p>
             </div>
          </div>
        </div>

        {/* Node List */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
           <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Node ID / Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">CPU (Used / Total)</th>
                <th className="px-6 py-4 font-medium">RAM (Used / Total)</th>
                <th className="px-6 py-4 font-medium">GPU (Used / Total)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {nodes.map((node, i) => {
                const totalCpu = node.resources?.CPU || 0;
                const remainingCpu = node.remaining?.CPU || 0;
                const usedCpu = totalCpu - remainingCpu;
                const cpuPercent = totalCpu > 0 ? (usedCpu / totalCpu) * 100 : 0;

                const totalRam = node.resources?.memory || 0;
                const remainingRam = node.remaining?.memory || 0;
                const usedRam = totalRam - remainingRam;
                const ramPercent = totalRam > 0 ? (usedRam / totalRam) * 100 : 0;

                const totalGpu = node.resources?.GPU || 0;
                const remainingGpu = node.remaining?.GPU || 0;
                const usedGpu = totalGpu - remainingGpu;
                const gpuPercent = totalGpu > 0 ? (usedGpu / totalGpu) * 100 : 0;

                return (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 flex flex-col">
                      <span>{node.node_name || 'Unknown'}</span>
                      <span className="text-xs text-slate-400 font-mono">{node.node_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center text-xs font-medium ${node.alive ? 'text-green-600' : 'text-red-600'}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${node.alive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {node.alive ? 'Alive' : 'Dead'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="w-16 text-right mr-2 text-xs">{usedCpu.toFixed(1)} / {totalCpu}</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${cpuPercent > 80 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${cpuPercent}%` }}></div></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                       <div className="flex items-center">
                        <span className="w-24 text-right mr-2 text-xs">{(usedRam / (1024**3)).toFixed(1)}G / {(totalRam / (1024**3)).toFixed(1)}G</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${ramPercent > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${ramPercent}%` }}></div></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {totalGpu > 0 ? (
                        <div className="flex items-center">
                          <span className="w-16 text-right mr-2 text-xs">{usedGpu} / {totalGpu}</span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${gpuPercent > 80 ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${gpuPercent}%` }}></div></div>
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
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">
                       No node data available. {isConnected ? 'Waiting for cluster state...' : 'Check connection.'}
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
