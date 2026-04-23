import { useState, useEffect } from 'react';
import { Server, Box, Cpu, HardDrive, List, MessageCircle, Bot, Trash2 } from 'lucide-react';
import { useClusterState } from '../../hooks/useClusterState';
import apiClient from '../../api/client';
import type { Workflow, WorkerIndividual } from '../../types';

interface LeftPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (id: string | null) => void;
}

export function LeftPanel({ activeTab, setActiveTab, selectedWorkflow, setSelectedWorkflow }: LeftPanelProps) {
  const { nodes } = useClusterState();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);

  const [workers, setWorkers] = useState<WorkerIndividual[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);

  const totalNodes = nodes.length;
  const aliveNodes = nodes.filter(n => n.alive).length;

  let totalCpu = 0;
  let usedCpu = 0;
  let totalMemory = 0;
  let usedMemory = 0;

  nodes.forEach(node => {
    const nodeTotalCpu = node.resources?.CPU || 0;
    const nodeRemainingCpu = node.remaining?.CPU || 0;
    totalCpu += nodeTotalCpu;
    usedCpu += (nodeTotalCpu - nodeRemainingCpu);

    const nodeTotalMem = node.resources?.memory || 0;
    const nodeRemainingMem = node.remaining?.memory || 0;
    totalMemory += nodeTotalMem;
    usedMemory += (nodeTotalMem - nodeRemainingMem);
  });

  const cpuPercent = totalCpu > 0 ? (usedCpu / totalCpu) * 100 : 0;
  const memPercent = totalMemory > 0 ? (usedMemory / totalMemory) * 100 : 0;

  useEffect(() => {
    if (activeTab === 'workflows') {
      const fetchWorkflows = async () => {
        setLoadingWorkflows(true);
        try {
          const response = await apiClient.get('/api/v1/workflow/list');
          // Fallback parsing just in case it returns an object or array
          const data = response.data;
          let parsedWorkflows: Workflow[] = [];
          if (Array.isArray(data)) {
            parsedWorkflows = data;
          } else if (data && typeof data === 'object') {
            // Suppose backend sends { workflows: [...] }
            parsedWorkflows = data.workflows || Object.values(data);
          }
          setWorkflows(parsedWorkflows);
        } catch (error) {
          console.error("Failed to fetch workflows", error);
          setWorkflows([]);
        } finally {
          setLoadingWorkflows(false);
        }
      };
      fetchWorkflows();
    } else if (activeTab === 'workers') {
      const fetchWorkersInner = async () => {
        setLoadingWorkers(true);
        try {
          const response = await apiClient.get('/api/v1/agent/worker');
          const data = response.data;
          let parsedWorkers: WorkerIndividual[] = [];
          if (Array.isArray(data)) {
            parsedWorkers = data;
          } else if (data && typeof data === 'object') {
            parsedWorkers = data.workers || Object.values(data);
          }
          setWorkers(parsedWorkers);
        } catch (error) {
          console.error("Failed to fetch workers", error);
          setWorkers([]);
        } finally {
          setLoadingWorkers(false);
        }
      };
      fetchWorkersInner();
    }
  }, [activeTab]);

  const fetchWorkers = async () => {
    setLoadingWorkers(true);
    try {
      const response = await apiClient.get('/api/v1/agent/worker');
      const data = response.data;
      let parsedWorkers: WorkerIndividual[] = [];
      if (Array.isArray(data)) {
        parsedWorkers = data;
      } else if (data && typeof data === 'object') {
        parsedWorkers = data.workers || Object.values(data);
      }
      setWorkers(parsedWorkers);
    } catch (error) {
      console.error("Failed to fetch workers", error);
      setWorkers([]);
    } finally {
      setLoadingWorkers(false);
    }
  };

  const handleDeleteWorker = async (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete worker ${agentId}?`)) return;
    try {
      await apiClient.delete(`/api/v1/agent/worker/${agentId}`);
      await fetchWorkers();
    } catch (err) {
      console.error("Failed to delete worker", err);
      alert("Failed to delete worker");
    }
  };

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
            <span className="text-sm font-medium text-slate-800">{aliveNodes} / {totalNodes || 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-slate-600">
              <Cpu size={16} className="mr-2 text-indigo-500" />
              <span className="text-sm">Cluster CPU</span>
            </div>
            <span className="text-sm font-medium text-slate-800">{cpuPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${cpuPercent}%` }}></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-slate-600">
              <HardDrive size={16} className="mr-2 text-green-500" />
              <span className="text-sm">Cluster RAM</span>
            </div>
            <span className="text-sm font-medium text-slate-800">
               {(totalMemory > 0 ? usedMemory / (1024 ** 3) : 0).toFixed(1)} GB
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${memPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Bottom: Tabs for Workflows & Basic Chats */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-3 text-[10px] font-medium text-center uppercase tracking-wider transition-colors ${activeTab === 'chats' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <MessageCircle size={12} className="inline mr-1 -mt-0.5" />
            Chats
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            className={`flex-1 py-3 text-[10px] font-medium text-center uppercase tracking-wider transition-colors ${activeTab === 'workflows' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <List size={12} className="inline mr-1 -mt-0.5" />
            Workflows
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`flex-1 py-3 text-[10px] font-medium text-center uppercase tracking-wider transition-colors ${activeTab === 'workers' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Bot size={12} className="inline mr-1 -mt-0.5" />
            Workers
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'workflows' && (
            <div className="space-y-2">
              {loadingWorkflows ? (
                <div className="text-center text-slate-400 text-sm py-4">Loading workflows...</div>
              ) : workflows.length === 0 ? (
                <div className="text-center text-slate-400 text-sm py-4">暂无工作流</div>
              ) : (
                workflows.map((wf) => (
                  <div
                    key={wf.event_id}
                    onClick={() => setSelectedWorkflow(wf.event_id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedWorkflow === wf.event_id ? 'border-blue-200 bg-blue-50 shadow-sm' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-medium text-sm ${selectedWorkflow === wf.event_id ? 'text-blue-700' : 'text-slate-700'}`}>{wf.workflow_title || 'Unnamed Workflow'}</span>
                      <span className={`flex h-2 w-2 rounded-full ${wf.status === 'running' ? 'bg-green-400 animate-pulse' : 'bg-slate-300'}`}></span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono line-clamp-1">ID: {wf.event_id}</p>
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === 'workers' && (
            <div className="space-y-2">
              {loadingWorkers ? (
                <div className="text-center text-slate-400 text-sm py-4">Loading workers...</div>
              ) : workers.length === 0 ? (
                <div className="text-center text-slate-400 text-sm py-4">No worker individuals</div>
              ) : (
                workers.map((worker) => (
                  <div
                    key={worker.agent_id}
                    className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition-all"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-slate-700">{worker.agent_name || 'Unnamed Worker'}</span>
                      <button
                        onClick={(e) => handleDeleteWorker(worker.agent_id, e)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer"
                        title="Delete Worker"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 font-mono line-clamp-1">ID: {worker.agent_id}</p>
                  </div>
                ))
              )}
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
