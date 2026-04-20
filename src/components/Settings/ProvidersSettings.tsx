import { useState, useEffect } from 'react';

import { Box, Plus } from 'lucide-react';
import type { Provider } from '../../types';
import apiClient from '../../api/client';

export function ProvidersSettings() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/v1/provider/list');
      const data = response.data.provider_list || {};
      const providerArray: Provider[] = Object.values(data);
      setProviders(providerArray);
    } catch (error) {
      console.error("Failed to fetch providers", error);
      // Fallback for development if API is not running
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProviders();
  }, []);

  const handleAddProvider = async () => {
    // Basic placeholder for adding a provider
    const type = prompt("Enter provider type (openai, gemini, claude):", "openai");
    const title = prompt("Enter provider title:", "My OpenAI");
    const url = prompt("Enter provider URL:", "https://api.openai.com/v1");
    const apiKey = prompt("Enter API Key:");

    if (type && title && url && apiKey) {
      try {
        await apiClient.post('/api/v1/provider', {
          provider_type: type,
          provider_title: title,
          provider_url: url,
          provider_apikey: apiKey
        });
        alert("Provider added successfully!");

    fetchProviders();
      } catch (error) {
        console.error("Error adding provider", error);
        alert("Failed to add provider.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">Provider Management</h3>
          <p className="text-sm text-slate-500 mt-1">Configure external AI model providers and API keys.</p>
        </div>
        <button
          onClick={handleAddProvider}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} className="mr-2" />
          Add Provider
        </button>
      </div>

      {loading ? (
        <div className="text-center text-slate-500 py-8">Loading providers...</div>
      ) : providers.length === 0 ? (
        <div className="text-center text-slate-500 py-8 bg-white rounded-xl border border-slate-200">
           No providers configured yet. Click "Add Provider" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {providers.map((provider, i) => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mr-3">
                    <Box size={20} className="text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{provider.provider_title}</h4>
                    <span className="text-xs text-slate-500 font-mono">{provider.provider_type}</span>
                  </div>
                </div>
                <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-md border ${provider.status === 'Connected' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {provider.status === 'Connected' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>}
                  {provider.status || 'Unknown'}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-1">URL / Endpoint:</p>
                <div className="bg-slate-50 border border-slate-100 rounded text-sm px-3 py-1.5 font-mono text-slate-700 truncate">
                  {provider.provider_url || 'Default'}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                 <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
