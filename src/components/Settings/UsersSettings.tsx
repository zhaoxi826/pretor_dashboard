import { useState } from 'react';

import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { User } from '../../types';
import apiClient from '../../api/client';

export function UsersSettings() {
  const [users, setUsers] = useState<User[]>([
     // Mock users for now since API doesn't have a get list yet
    { user_name: 'admin', role: 'Administrator', status: 'Active' },
    { user_name: 'zhaoxi', role: 'User', status: 'Active' }
  ]);

  const handleAddUser = async () => {
    const username = prompt("Enter new username:");
    const password = prompt("Enter password:");

    if (username && password) {
      try {
        await apiClient.post('/api/v1/auth/register', {
          user_name: username,
          password: password
        });
        alert("User registered successfully!");
        // Optimistically add to list
        setUsers([...users, { user_name: username, role: 'User', status: 'Active' }]);
      } catch (error) {
        console.error("Failed to register user", error);
        alert("Registration failed.");
      }
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
          onClick={handleAddUser}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
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
                  <button className="text-slate-400 hover:text-blue-600 mr-3 transition-colors" title="Edit"><Edit2 size={16} /></button>
                  <button className="text-slate-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
