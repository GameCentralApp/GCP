import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import ServerCard from '../components/UI/ServerCard';
import toast from 'react-hot-toast';

const Servers: React.FC = () => {
  const [servers, setServers] = useState([
    {
      id: '1',
      name: 'Minecraft Creative',
      game: 'Minecraft',
      status: 'online' as const,
      players: { current: 24, max: 50 },
      resources: { cpu: 45, memory: 67 },
      uptime: '2d 14h'
    },
    {
      id: '2',
      name: 'CS:GO Competitive',
      game: 'CS:GO',
      status: 'online' as const,
      players: { current: 18, max: 20 },
      resources: { cpu: 32, memory: 54 },
      uptime: '1d 8h'
    },
    {
      id: '3',
      name: 'Rust Vanilla',
      game: 'Rust',
      status: 'offline' as const,
      players: { current: 0, max: 100 },
      resources: { cpu: 0, memory: 0 },
      uptime: '0m'
    },
    {
      id: '4',
      name: 'GMod DarkRP',
      game: "Garry's Mod",
      status: 'starting' as const,
      players: { current: 0, max: 32 },
      resources: { cpu: 15, memory: 23 },
      uptime: '0m'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         server.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || server.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleServerStart = async (id: string) => {
    setServers(prev => prev.map(server => 
      server.id === id ? { ...server, status: 'starting' as const } : server
    ));
    
    // Simulate API call
    setTimeout(() => {
      setServers(prev => prev.map(server => 
        server.id === id ? { ...server, status: 'online' as const } : server
      ));
      toast.success('Server started successfully');
    }, 2000);
  };

  const handleServerStop = async (id: string) => {
    setServers(prev => prev.map(server => 
      server.id === id ? { ...server, status: 'stopping' as const } : server
    ));
    
    setTimeout(() => {
      setServers(prev => prev.map(server => 
        server.id === id ? { ...server, status: 'offline' as const, resources: { cpu: 0, memory: 0 } } : server
      ));
      toast.success('Server stopped successfully');
    }, 1500);
  };

  const handleServerRestart = async (id: string) => {
    await handleServerStop(id);
    setTimeout(() => handleServerStart(id), 2000);
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
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
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
            className="px-3 py-2 bg-dark-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
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

      {filteredServers.length === 0 && (
        <div className="text-center py-12">
          <div className="h-16 w-16 text-gray-500 mx-auto mb-4 flex items-center justify-center">
            <Server className="h-16 w-16" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No servers found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first game server to get started'
            }
          </p>
          <button className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors mx-auto">
            <Plus className="h-4 w-4" />
            <span>Create Server</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Servers;