import React from 'react';
import { Plus, Crown, User, Eye } from 'lucide-react';

const Users: React.FC = () => {
  const users = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@gamecentral.com',
      role: 'admin',
      status: 'online'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage user accounts and permissions</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          <span>Create User</span>
        </button>
      </div>

      <div className="bg-dark-800 border border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-900 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Role</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-white">{user.username}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-red-900/20 text-red-400">
                    <Crown className="h-3 w-3" />
                    <span>Admin</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-400">Online</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;