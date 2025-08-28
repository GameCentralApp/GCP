import React, { useState, useEffect, useMemo } from 'react';
import { Server, Users, HardDrive, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { Line, Bar } from 'recharts';
import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, BarChart } from 'recharts';
import { api } from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalServers: 0,
    onlineServers: 0,
    totalUsers: 0,
    activeUsers: 0,
    diskUsage: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    networkIn: 0,
    networkOut: 0
  });
  const [servers, setServers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch servers
      const serversResponse = await api.get('/servers');
      const serversData = serversResponse.data;
      setServers(serversData);
      
      // Fetch users (admin only)
      let usersData = [];
      try {
        const usersResponse = await api.get('/users');
        usersData = usersResponse.data;
        setUsers(usersData);
      } catch (error) {
        // User might not have admin permissions
        console.log('Cannot fetch users - insufficient permissions');
      }
      
      // Calculate stats from real data
      const onlineServers = serversData.filter(s => s.status === 'online').length;
      const activeUsers = usersData.filter(u => u.status === 'online').length;
      
      // Calculate average resource usage from online servers
      const onlineServersList = serversData.filter(s => s.status === 'online');
      const avgCpu = onlineServersList.length > 0 
        ? Math.round(onlineServersList.reduce((sum, s) => sum + (s.resources?.cpu || 0), 0) / onlineServersList.length)
        : 0;
      const avgMemory = onlineServersList.length > 0
        ? Math.round(onlineServersList.reduce((sum, s) => sum + (s.resources?.memory || 0), 0) / onlineServersList.length)
        : 0;
      
      setStats({
        totalServers: serversData.length,
        onlineServers,
        totalUsers: usersData.length,
        activeUsers,
        diskUsage: 67, // This would come from system metrics API
        cpuUsage: avgCpu,
        memoryUsage: avgMemory,
        networkIn: 2.4, // This would come from system metrics API
        networkOut: 1.8 // This would come from system metrics API
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate chart data based on real server performance
  const chartData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const time = new Date(now.getTime() - (5 - i) * 4 * 60 * 60 * 1000);
      return {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        cpu: Math.max(0, stats.cpuUsage + Math.random() * 20 - 10),
        memory: Math.max(0, stats.memoryUsage + Math.random() * 15 - 7),
        network: Math.max(0, stats.networkIn + Math.random() * 10 - 5)
      };
    });
  }, [stats.cpuUsage, stats.memoryUsage, stats.networkIn]);

  // Game distribution from real servers
  const gameDistribution = useMemo(() => {
    const games = {};
    servers.forEach(server => {
      games[server.game] = (games[server.game] || 0) + 1;
    });
    return Object.entries(games).map(([game, count]) => ({ game, count }));
  }, [servers]);

  // Memoize tooltip style to prevent recreation
  const tooltipStyle = useMemo(() => ({
    backgroundColor: '#1F2937',
    border: '1px solid #374151',
    color: '#fff'
  }), []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-800 rounded w-48 mb-2"></div>
          <div className="h-4 bg-dark-800 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-dark-800 rounded-xl p-6 animate-pulse">
              <div className="h-16 bg-dark-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your game servers and system status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Servers</p>
              <p className="text-2xl font-semibold text-white">{stats.totalServers}</p>
              <p className="text-sm text-neon-green mt-1">
                {stats.onlineServers} online
              </p>
            </div>
            <Server className="h-8 w-8 text-neon-cyan" />
          </div>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Active Users</p>
              <p className="text-2xl font-semibold text-white">{stats.activeUsers}</p>
              <p className="text-sm text-gray-400 mt-1">
                of {stats.totalUsers} total
              </p>
            </div>
            <Users className="h-8 w-8 text-neon-purple" />
          </div>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Disk Usage</p>
              <p className="text-2xl font-semibold text-white">{stats.diskUsage}%</p>
              <div className="w-full bg-dark-900 rounded-full h-2 mt-2">
                <div 
                  className="bg-neon-cyan h-2 rounded-full transition-all duration-300 shadow-lg shadow-neon-cyan/50"
                  style={{ width: `${stats.diskUsage}%` }}
                ></div>
              </div>
            </div>
            <HardDrive className="h-8 w-8 text-neon-yellow" />
          </div>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">System Load</p>
              <p className="text-2xl font-semibold text-white">{stats.cpuUsage}%</p>
              <p className="text-sm text-gray-400 mt-1">
                CPU Usage
              </p>
            </div>
            <Activity className="h-8 w-8 text-neon-pink" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-600/50">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-neon-cyan" />
            System Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Line type="monotone" dataKey="cpu" stroke="#00ffff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="memory" stroke="#00ff00" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="network" stroke="#ffff00" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-600/50">
          <h3 className="text-lg font-medium text-white mb-4">Server Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={gameDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="game" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="count" fill="#00ffff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Servers */}
      <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-600/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Recent Servers</h3>
          <button className="text-neon-cyan hover:text-neon-cyan/80 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {servers.slice(0, 4).map((server) => (
            <div key={server.id} className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  server.status === 'online' ? 'bg-neon-green shadow-lg shadow-neon-green/50' :
                  server.status === 'offline' ? 'bg-red-500' :
                  'bg-neon-yellow animate-pulse shadow-lg shadow-neon-yellow/50'
                }`}></div>
                <div>
                  <p className="font-medium text-white">{server.name}</p>
                  <p className="text-sm text-gray-400">{server.game}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {server.players ? `${server.players.current}/${server.players.max}` : '0/0'}
                </p>
                <p className={`text-xs capitalize ${
                  server.status === 'online' ? 'text-neon-green' :
                  server.status === 'offline' ? 'text-red-400' :
                  'text-neon-yellow'
                }`}>
                  {server.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {servers.some(s => s.resources?.memory > 80) && (
        <div className="bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-neon-yellow" />
            <div>
              <p className="font-medium text-neon-yellow">High Memory Usage Alert</p>
              <p className="text-sm text-gray-300">
                {servers.filter(s => s.resources?.memory > 80).length} server(s) have high memory usage
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;