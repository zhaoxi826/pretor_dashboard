import React, { useState } from 'react';
import { apiClient } from '../../api/client';

export function UsersSettings() {
  const [userId, setUserId] = useState('');
  const [newAuthority, setNewAuthority] = useState<number>(20);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangeAuthority = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      await apiClient.put('/api/v1/auth/authority', {
        user_id: userId,
        new_authority: newAuthority
      });
      setMessage('Authority updated successfully');
      setUserId('');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setMessage(e.response?.data?.detail || 'Failed to update authority. (Requires Super Admin)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">User Management</h3>
          <p className="text-sm text-slate-500 mt-1">Manage system users and their roles.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <h4 className="text-sm font-semibold text-slate-800 mb-4">Change User Authority</h4>
        <form onSubmit={handleChangeAuthority} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
            <input
              type="text"
              required
              value={userId}
              onChange={e => setUserId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Enter User ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Authority Level</label>
            <select
              value={newAuthority}
              onChange={e => setNewAuthority(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value={100}>Super Administrator</option>
              <option value={50}>Administrator</option>
              <option value={20}>User</option>
              <option value={10}>Unauthorized User</option>
              <option value={0}>Guest</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Authority'}
          </button>
          {message && <p className={`text-sm mt-2 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        </form>
      </div>
    </div>
  );
}
