import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Loader2, Trash2 } from 'lucide-react';

interface WorkerAgent {
  agent_id: string;
  agent_name: string;
  agent_type: number;
  description: string;
  provider_title: string;
  model_id: string;
  system_prompt: string;
}

export function WorkerAgentsList() {
  const [agents, setAgents] = useState<WorkerAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/api/v1/agent/worker');
      setAgents(res.data.workers || []);
    } catch (err) {
      console.error('Failed to fetch agents', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await apiClient.get('/api/v1/agent/worker');
        if (mounted) {
          setAgents(res.data.workers || []);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch agents', err);
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    try {
      await apiClient.delete(`/api/v1/agent/worker/${agentId}`);
      fetchAgents();
    } catch (err) {
      console.error('Failed to delete agent', err);
      alert('Failed to delete agent');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin text-slate-400" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {agents.length === 0 ? (
        <div className="text-xs text-slate-400 p-2 text-center border border-dashed border-slate-200 rounded">
          No active workflows.
        </div>
      ) : (
        agents.map((agent) => (
          <div key={agent.agent_id} className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-slate-50 cursor-pointer transition-all">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm text-slate-700">{agent.agent_name}</span>
              <div className="flex items-center space-x-1">
                <button onClick={(e) => { e.stopPropagation(); handleDelete(agent.agent_id); }} className="text-slate-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">{agent.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
