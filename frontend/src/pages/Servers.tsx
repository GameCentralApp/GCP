import React, { useState, useEffect } from 'react';
import { Plus, Play, Square, RotateCcw } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const Servers: React.FC = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const response = await api.get('/servers');
      setServers(response.data);
    } catch (error) {
      toast.error('Failed to fetch servers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading servers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Game Servers</h1>
          <p className="text-gray-400">Manage your game server instances</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          <span>Create Server</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map((server: any) => (
          <div key={server.id} className="bg-dark-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">{server.name}</h3>
                <p className="text-sm text-gray-400">{server.game}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                server.status === 'online' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {server.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-dark-900 rounded p-3">
                <div className="text-xs text-gray-400 mb-1">Players</div>
                <div className="text-lg font-semibold text-white">
                  {server.players.current}/{server.players.max}
                </div>
              </div>
              <div className="bg-dark-900 rounded p-3">
                <div className="text-xs text-gray-400 mb-1">CPU</div>
                <div className="text-lg font-semibold text-white">
                  {server.resources.cpu}%
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors">
                <Play className="h-4 w-4" />
                <span className="text-sm">Start</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors">
                <Square className="h-4 w-4" />
                <span className="text-sm">Stop</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servers;