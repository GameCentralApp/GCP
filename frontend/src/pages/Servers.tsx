import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw, Server } from 'lucide-react';
import ServerCard from '../components/UI/ServerCard';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const Servers: React.FC = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/servers');
      setServers(response.data);
    } catch (error) {
      console.error('Error fetching servers:', error);
      toast.error('Failed to fetch servers');
    } finally {
      setLoading(false);
    }
  };

  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         server.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || server.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleServerStart = async (id: string) => {
    try {
      setServers(prev => prev.map(server => 
        server.id === id ? { ...server, status: 'starting' as const } : server
      ));
      
      await api.post(`/servers/${id}/start`);
      
      // Refresh server data
      await fetchServers();
      toast.success('Server started successfully');
    } catch (error) {
      console.error('Error starting server:', error);
      toast.error('Failed to start server');
      // Revert status on error
      setServers(prev => prev.map(server => 
        server.id === id ? { ...server, status: 'offline' as const } : server
      ));
    }
  };

  const handleServerStop = async (id: string) => {
    try {
      setServers(prev => prev.map(server => 
        server.id === id ? { ...server, status: 'stopping' as const } : server
      ));
      
      await api.post(`/servers/${id}/stop`);
      
      // Refresh server data
      await fetchServers();
      toast.success('Server stopped successfully');
    } catch (error) {
      console.error('Error stopping server:', error);
      toast.error('Failed to stop server');
      // Revert status on error
      setServers(prev => prev.map(server => 
        server.id === id ? { ...server, status: 'online' as const } : server
      ));
    }
  };

  const handleServerRestart = async (id: string) => {
    try {
      setServers(prev => prev.map(server => 
        server.id === id ? { ...server, status: 'stopping' as const } : server
      ));
      
      await api.post(`/servers/${id}/restart`);
      
      // Refresh server data
      await fetchServers();
      toast.success('Server restarted successfully');
    } catch (error) {
      console.error('Error restarting server:', error);
      toast.error('Failed to restart server');
    }
  };

  const handleServerManage = (id: string) => {
    window.location.href = `/servers/${id}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Game Servers</h1>
          <p className="text-gray-400">Manage and monitor your game server instances</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-dark-800/50 hover:bg-dark-700 border border-gray-700 hover:border-gray-600 rounded-lg transition-colors text-gray-300 hover:text-white">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button 
            onClick={fetchServers}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-800/50 hover:bg-dark-700 border border-gray-700 hover:border-gray-600 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 hover:bg-neon-cyan hover:text-dark-950 text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            <span>Create Server</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search servers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-dark-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="starting">Starting</option>
            <option value="stopping">Stopping</option>
          </select>
        </div>
      </div>

      {/* Servers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-dark-800 rounded-xl p-6 animate-pulse">
              <div className="h-32 bg-dark-700 rounded mb-4"></div>
              <div className="h-4 bg-dark-700 rounded mb-2"></div>
              <div className="h-4 bg-dark-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServers.map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              onStart={handleServerStart}
              onStop={handleServerStop}
              onRestart={handleServerRestart}
              onManage={handleServerManage}
            />
          ))}
        </div>
      )}

      {filteredServers.length === 0 && (
        <div className="text-center py-12">
          <div className="h-16 w-16 text-gray-500 mx-auto mb-4 flex items-center justify-center">
            <Server className="h-16 w-16 text-gray-600" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No servers found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first game server to get started'
            }
          </p>
          <button className="flex items-center space-x-2 px-6 py-3 bg-neon-cyan/20 hover:bg-neon-cyan hover:text-dark-950 text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan rounded-lg transition-colors mx-auto">
            <Plus className="h-4 w-4" />
            <span>Create Server</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Servers;