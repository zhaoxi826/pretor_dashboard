// General types

export interface TokenData {
  user_id: string;
  user_name: string;
}

export interface User {
  user_id?: string;
  user_name: string;
  role?: string;
  status?: string;
}

// Provider types
export interface Provider {
  provider_type: 'openai' | 'gemini' | 'claude' | 'local';
  provider_title: string;
  provider_url?: string;
  provider_owner?: string;
  // Based on your UI needs we might infer some local status fields
  status?: string;
  model?: string;
}

export interface ProviderRegisterRequest {
  provider_type: 'openai' | 'gemini' | 'claude' | 'local';
  provider_title: string;
  provider_url: string;
  provider_apikey: string;
}

export interface ProviderListResponse {
  provider_list: Record<string, Provider>;
}

// Cluster types (Websocket response)
export interface ClusterResources {
  CPU?: number;
  memory?: number;
  GPU?: number;
  [key: string]: number | undefined;
}

export interface ClusterNode {
  node_id: string;
  node_name: string;
  alive: boolean;
  resources: ClusterResources;
  remaining: ClusterResources;
}

// Chat types
export interface ChatMessageRequest {
  message: string;
}

export interface ChatMessageResponse {
  message: string; // Either event_id or text
}

// Workflow types
export interface Workflow {
  event_id: string;
  workflow_title: string;
  status?: string;
}

// Worker Individual types
export interface WorkerIndividual {
  agent_id: string;
  agent_name?: string;
  description?: string;
  status?: string;
}
