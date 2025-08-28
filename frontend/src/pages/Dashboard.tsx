import React, { useState, useEffect } from 'react';
import { Server, Users, HardDrive, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { Line, Bar } from 'recharts';
import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, BarChart } from 'recharts';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalServers: 12,
    onlineServers: 8,
    totalUsers: 145,
    activeUsers: 67,
    diskUsage: 67,
    cpuUsage: 45,
    memoryUsage: 72,
    networkIn: 2.4,
    networkOut: 1.8
  });

  const [chartData] = useState([
    { time: '00:00', cpu: 25, memory: 45, network: 12 },
    { time: '04:00', cpu: 32, memory: 52, network: 18 },
    { time: '08:00', cpu: 45, memory: 67, network: 24 },
    { time: '12:00', cpu: 67, memory: 78, network: 35 },
    { time: '16:00', cpu: 54, memory: 65, network: 28 },
    { time: '20:00', cpu: 38, memory: 58, network: 22 },
  ]);

  const [recentServers] = useState([
    { id: '1', name: 'Minecraft Creative', game: 'Minecraft', status: 'online', players: '24/50' },
    { id: '2', name: 'CS:GO Competitive', game: 'CS:GO', status: 'online', players: '18/20' },
    { id: '3', name: 'Rust Vanilla', game: 'Rust', status: 'offline', players: '0/100' },
    { id: '4', name: 'GMod DarkRP', game: "Garry's Mod", status: 'starting', players: '0/32' },
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
              <p className="text-sm text-green-400 mt-1">
                {stats.onlineServers} online
              </p>
            </div>
            <Server className="h-12 w-12 text-primary-500" />
          </div>
        </div>

        <div className="bg-dark-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Active Users</p>
              <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
              <p className="text-sm text-gray-400 mt-1">
                of {stats.totalUsers} total
              </p>
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
              <p className="text-sm text-gray-400 mt-1">
                CPU Usage
              </p>
            </div>
            <Activity className="h-12 w-12 text-primary-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            System Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  color: '#fff'
                }} 
              />
              <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="network" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Server Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { game: 'Minecraft', count: 5 },
              { game: 'CS:GO', count: 3 },
              { game: 'Rust', count: 2 },
              { game: 'GMod', count: 2 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="game" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Servers */}
      <div className="bg-dark-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Recent Servers</h3>
          <button className="text-primary-500 hover:text-primary-400 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {recentServers.map((server) => (
            <div key={server.id} className="flex items-center justify-between p-4 bg-dark-900 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  server.status === 'online' ? 'bg-green-500' :
                  server.status === 'offline' ? 'bg-red-500' :
                  'bg-yellow-500 animate-pulse'
                }`}></div>
                <div>
                  <p className="font-medium text-white">{server.name}</p>
                  <p className="text-sm text-gray-400">{server.game}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{server.players}</p>
                <p className={`text-xs capitalize ${
                  server.status === 'online' ? 'text-green-400' :
                  server.status === 'offline' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {server.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-dark-800 border border-yellow-600 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <div>
            <p className="font-medium text-white">System Alert</p>
            <p className="text-sm text-gray-300">High memory usage detected on Minecraft Creative server</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;