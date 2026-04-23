import React, { useState, useEffect } from 'react';
import { Box, Plus, Trash2, Loader2 } from 'lucide-react';
import { apiClient } from '../../api/client';

interface Provider {
  provider_type: string;
  provider_title: string;
  provider_url: string;
}

export function ProvidersSettings() {
  const [providers, setProviders] = useState<Record<string, Provider>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [type, setType] = useState<'openai' | 'gemini' | 'claude'>('openai');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/api/v1/provider/list');
      setProviders(res.data.provider_list);
    } catch (err) {
      console.error('Failed to fetch providers', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await apiClient.get('/api/v1/provider/list');
        if (mounted) {
          setProviders(res.data.provider_list);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch providers', err);
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/v1/provider', {
        provider_type: type,
        provider_title: title,
        provider_url: url,
        provider_apikey: apiKey
      });
      setShowAddModal(false);
      setTitle('');
      setUrl('');
      setApiKey('');
      fetchProviders();
    } catch (err) {
      console.error('Failed to add provider', err);
      alert('Failed to add provider');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProvider = async (providerTitle: string) => {
    if (!confirm('Are you sure you want to delete this provider?')) return;
    try {
      await apiClient.delete(`/api/v1/provider/${providerTitle}`);
      fetchProviders();
    } catch (err) {
      console.error('Failed to delete provider', err);
      alert('Failed to delete provider. Requires Super Admin.');
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
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} className="mr-2" />
          Add Provider
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {Object.values(providers).length === 0 ? (
            <div className="col-span-2 text-center py-12 text-slate-500 bg-white border border-slate-200 rounded-xl">
              No providers configured.
            </div>
          ) : (
            Object.values(providers).map((provider, i) => (
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
                </div>
                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-1">URL:</p>
                  <div className="bg-slate-50 border border-slate-100 rounded text-sm px-3 py-1.5 font-mono text-slate-700 truncate" title={provider.provider_url}>
                    {provider.provider_url}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                   <button
                    onClick={() => handleDeleteProvider(provider.provider_title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                   >
                    <Trash2 size={16} />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Provider Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Add Provider</h3>
              <form onSubmit={handleAddProvider} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Provider Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as 'openai' | 'gemini' | 'claude')}
                    className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="gemini">Gemini</option>
                    <option value="claude">Claude</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text" required value={title} onChange={e => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2"
                    placeholder="My OpenAI Provider"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
                  <input
                    type="text" required value={url} onChange={e => setUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2"
                    placeholder="https://api.openai.com/v1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
                  <input
                    type="password" required value={apiKey} onChange={e => setApiKey(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2"
                    placeholder="sk-..."
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                    Add Provider
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
