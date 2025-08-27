import React from 'react';
import { Play, Square, RotateCcw, Settings, FileText, Activity } from 'lucide-react';
import clsx from 'clsx';

interface ServerCardProps {
  server: {
    id: string;
    name: string;
    game: string;
    status: 'online' | 'offline' | 'starting' | 'stopping';
    players: { current: number; max: number };
    resources: { cpu: number; memory: number };
    uptime: string;
  };
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onRestart: (id: string) => void;
  onManage: (id: string) => void;
}

const ServerCard: React.FC<ServerCardProps> = ({ 
  server, 
  onStart, 
  onStop, 
  onRestart, 
  onManage 
}) => {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    starting: 'bg-yellow-500 animate-pulse',
    stopping: 'bg-orange-500 animate-pulse'
  };

  const isRunning = server.status === 'online';
  const isTransitioning = server.status === 'starting' || server.status === 'stopping';

  return (
    <div className="bg-dark-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={clsx('w-3 h-3 rounded-full', statusColors[server.status])}></div>
          <div>
            <h3 className="font-semibold text-white">{server.name}</h3>
            <p className="text-sm text-gray-400">{server.game}</p>
          </div>
        </div>
        <span className={clsx(
          'px-2 py-1 text-xs rounded-full capitalize',
          isRunning ? 'bg-green-600 text-white' :
          server.status === 'offline' ? 'bg-red-600 text-white' :
          'bg-yellow-600 text-black'
        )}>
          {server.status}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-dark-900 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">Players</div>
          <div className="text-lg font-semibold text-white">
            {server.players.current}/{server.players.max}
          </div>
        </div>
        <div className="bg-dark-900 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">CPU Usage</div>
          <div className="text-lg font-semibold text-white">
            {server.resources.cpu}%
          </div>
        </div>
        <div className="bg-dark-900 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">Memory</div>
          <div className="text-lg font-semibold text-white">
            {server.resources.memory}%
          </div>
        </div>
        <div className="bg-dark-900 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">Uptime</div>
          <div className="text-lg font-semibold text-white">
            {server.uptime}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {!isRunning && !isTransitioning && (
            <button
              onClick={() => onStart(server.id)}
              className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
            >
              <Play className="h-4 w-4" />
              <span className="text-sm">Start</span>
            </button>
          )}
          
          {isRunning && (
            <button
              onClick={() => onStop(server.id)}
              className="flex items-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
            >
              <Square className="h-4 w-4" />
              <span className="text-sm">Stop</span>
            </button>
          )}
          
          {isRunning && (
            <button
              onClick={() => onRestart(server.id)}
              className="flex items-center space-x-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="text-sm">Restart</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onManage(server.id)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Manage Server"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="View Files"
          >
            <FileText className="h-4 w-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="View Console"
          >
            <Activity className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerCard;