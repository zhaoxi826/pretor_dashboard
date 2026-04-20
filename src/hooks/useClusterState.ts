import { useState, useEffect } from 'react';
import type { ClusterNode } from '../types';

export function useClusterState() {
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

  return { nodes, isConnected };
}
