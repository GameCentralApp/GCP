import React from 'react';
import { Server, Users, HardDrive, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = {
    totalServers: 12,
    onlineServers: 8,
    totalUsers: 145,
    activeUsers: 67,
    diskUsage: 67,
    cpuUsage: 45
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your game servers and system status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Servers</p>
              <p className="text-3xl font-bold text-white">{stats.totalServers}</p>
              <p className="text-sm text-green-400 mt-1">{stats.onlineServers} online</p>
            </div>
            <Server className="h-12 w-12 text-primary-500" />
          </div>
        </div>

        <div className="bg-dark-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Active Users</p>
              <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
              <p className="text-sm text-gray-400 mt-1">of {stats.totalUsers} total</p>
            </div>
            <Users className="h-12 w-12 text-primary-500" />
          </div>
        </div>

        <div className="bg-dark-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Disk Usage</p>
              <p className="text-3xl font-bold text-white">{stats.diskUsage}%</p>
              <div className="w-full bg-dark-900 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.diskUsage}%` }}
                ></div>
              </div>
            </div>
            <HardDrive className="h-12 w-12 text-primary-500" />
          </div>
        </div>

        <div className="bg-dark-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">System Load</p>
              <p className="text-3xl font-bold text-white">{stats.cpuUsage}%</p>
              <p className="text-sm text-gray-400 mt-1">CPU Usage</p>
            </div>
            <Activity className="h-12 w-12 text-primary-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-dark-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-dark-900 rounded">
            <span className="text-gray-300">Minecraft Creative server started</span>
            <span className="text-sm text-gray-400">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-dark-900 rounded">
            <span className="text-gray-300">User john_doe logged in</span>
            <span className="text-sm text-gray-400">5 minutes ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-dark-900 rounded">
            <span className="text-gray-300">CS:GO server restarted</span>
            <span className="text-sm text-gray-400">10 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;