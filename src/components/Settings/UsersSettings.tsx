import { useState } from 'react';
import { Plus, CheckCircle, Shield, X } from 'lucide-react';
import type { User } from '../../types';
import apiClient from '../../api/client';

// Extending User type locally if needed for demo purposes since backend doesn't have list users
interface ExtendedUser extends User {
  user_authority?: number;
}

export function UsersSettings() {
  const [users, setUsers] = useState<ExtendedUser[]>([
    { user_id: '1', user_name: 'admin', role: 'Administrator', status: 'Active', user_authority: 50 },
    { user_id: '2', user_name: 'zhaoxi', role: 'User', status: 'Active', user_authority: 20 },
    { user_id: '3', user_name: 'new_user', role: 'Unauthorized', status: 'Pending', user_authority: 10 }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleOpenModal = () => {
    setFormData({ username: '', password: '' });
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please fill in both username and password.');
      return;
    }

    setSubmitLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/api/v1/auth/register', {
        user_name: formData.username,
        password: formData.password
      });
      // Optimistically add to list
      setUsers([...users, { user_id: res.data?.user_id || Date.now().toString(), user_name: formData.username, role: 'User', status: 'Active', user_authority: 20 }]);
      handleCloseModal();
    } catch (err) {
      console.error("Failed to register user", err);
      setError('Registration failed. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdateAuthority = async (userId: string | undefined, newAuthority: number, newRole: string, newStatus: string) => {
    if (!userId) return;
    setActionLoading(userId);
    try {
      await apiClient.put('/api/v1/auth/authority', {
        user_id: userId,
        new_authority: newAuthority
      });
      setUsers(users.map(u => u.user_id === userId ? { ...u, user_authority: newAuthority, role: newRole, status: newStatus } : u));
    } catch (err) {
      console.error("Failed to update authority", err);
      alert('Failed to update authority. Make sure you are a Super Administrator.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">User Management</h3>
          <p className="text-sm text-slate-500 mt-1">Manage system users and their roles.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} className="mr-2" />
          Add User
        </button>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Username</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{user.user_name}</td>
                <td className="px-6 py-4 text-slate-600">{user.role || 'User'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                    {user.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {user.user_authority === 10 && (
                    <button
                      onClick={() => handleUpdateAuthority(user.user_id, 20, 'User', 'Active')}
                      disabled={actionLoading === user.user_id}
                      className="text-slate-400 hover:text-green-600 mr-3 transition-colors cursor-pointer disabled:opacity-50"
                      title="Approve User"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  {user.user_authority === 20 && (
                    <button
                      onClick={() => handleUpdateAuthority(user.user_id, 50, 'Administrator', 'Active')}
                      disabled={actionLoading === user.user_id}
                      className="text-slate-400 hover:text-blue-600 mr-3 transition-colors cursor-pointer disabled:opacity-50"
                      title="Promote to Admin"
                    >
                      <Shield size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Add New User</h3>
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="e.g. jsmith"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter secure password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
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
                      Creating...
                    </span>
                  ) : (
                    'Add User'
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
