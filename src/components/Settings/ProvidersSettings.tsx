import { useState, useEffect } from 'react';
import { Plus, Box, X, Trash2 } from 'lucide-react';
import type { Provider } from '../../types';
import apiClient from '../../api/client';

export function ProvidersSettings() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    provider_type: 'openai',
    provider_title: '',
    provider_url: '',
    provider_apikey: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/v1/provider/list');
      const data = response.data.provider_list || {};
      const providerArray: Provider[] = Object.values(data);
      setProviders(providerArray);
    } catch (error) {
      console.error("Failed to fetch providers", error);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProviders();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      provider_type: 'openai',
      provider_title: '',
      provider_url: '',
      provider_apikey: ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.provider_title || !formData.provider_url || !formData.provider_apikey) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitLoading(true);
    setError('');
    try {
      await apiClient.post('/api/v1/provider', formData);
      await fetchProviders();
      handleCloseModal();
    } catch (err) {
      console.error("Error adding provider", err);
      setError('Failed to add provider. Please check your inputs and try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteProvider = async (providerTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete the provider "${providerTitle}"?`)) return;
    try {
      await apiClient.delete(`/api/v1/provider/${providerTitle}`);
      await fetchProviders();
    } catch (err) {
      console.error("Error deleting provider", err);
      alert('Failed to delete provider. You may need Super Administrator privileges.');
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
          onClick={handleOpenModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm cursor-pointer"
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
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-blue-200 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mr-3">
                      <Box size={20} className="text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{provider.provider_title}</h4>
                      <span className="text-xs text-slate-500 font-mono uppercase">{provider.provider_type}</span>
                    </div>
                  </div>
                  <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-md border ${provider.status === 'Connected' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {provider.status === 'Connected' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>}
                    {provider.status || 'Unknown'}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-1">URL / Endpoint:</p>
                  <div className="bg-slate-50 border border-slate-100 rounded text-sm px-3 py-1.5 font-mono text-slate-700 truncate" title={provider.provider_url}>
                    {provider.provider_url || 'Default'}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                 <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors cursor-pointer">Edit</button>
                 <button
                   onClick={() => handleDeleteProvider(provider.provider_title)}
                   className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                   title="Delete"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Provider Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Add New Provider</h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Provider Type</label>
                <select
                  name="provider_type"
                  value={formData.provider_type}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Gemini</option>
                  <option value="claude">Claude</option>
                  <option value="local">Local</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Provider Title</label>
                <input
                  type="text"
                  name="provider_title"
                  placeholder="e.g. My OpenAI Instance"
                  value={formData.provider_title}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Base URL</label>
                <input
                  type="url"
                  name="provider_url"
                  placeholder="e.g. https://api.openai.com/v1"
                  value={formData.provider_url}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">API Key</label>
                <input
                  type="password"
                  name="provider_apikey"
                  placeholder="sk-..."
                  value={formData.provider_apikey}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-70 flex items-center"
                >
                  {submitLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Add Provider'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
