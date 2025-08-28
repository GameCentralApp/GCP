import React from 'react';
import { Play, Square, RotateCcw, Settings, FileText, Activity, Zap } from 'lucide-react';
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
  const statusConfig = {
    online: {
      color: 'bg-neon-green',
      glow: 'shadow-neon-green/50',
      text: 'text-neon-green',
      badge: 'bg-neon-green/20 text-neon-green border-neon-green/30'
    },
    offline: {
      color: 'bg-red-500',
      glow: 'shadow-red-500/30',
      text: 'text-red-400',
      badge: 'bg-red-500/20 text-red-400 border-red-500/30'
    },
    starting: {
      color: 'bg-neon-yellow animate-pulse',
      glow: 'shadow-neon-yellow/50',
      text: 'text-neon-yellow',
      badge: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30 animate-pulse'
    },
    stopping: {
      color: 'bg-orange-500 animate-pulse',
      glow: 'shadow-orange-500/50',
      text: 'text-orange-400',
      badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30 animate-pulse'
    }
  };

  const config = statusConfig[server.status];
  const isRunning = server.status === 'online';
  const isTransitioning = server.status === 'starting' || server.status === 'stopping';

  return (
    <div className="card group hover:scale-[1.02] transition-all duration-300">
      {/* Neon accent border for online servers */}
      {isRunning && (
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-purple/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className={clsx('w-3 h-3 rounded-full', config.color)}></div>
              {isRunning && (
                <div className="absolute inset-0 w-3 h-3 bg-neon-green rounded-full animate-ping opacity-75"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 group-hover:text-white transition-colors">
                {server.name}
              </h3>
              <p className="text-sm text-gray-400">{server.game}</p>
            </div>
          </div>
          <span className={clsx(
            'px-3 py-1 text-xs rounded-full font-medium border capitalize transition-all duration-200',
            config.badge
          )}>
            {server.status}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-dark-900/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30 hover:border-gray-600/50 transition-colors">
            <div className="text-xs text-gray-400 mb-1">Players</div>
            <div className="text-lg font-bold text-gray-100">
              <span className="text-neon-cyan">{server.players.current}</span>
              <span className="text-gray-500">/{server.players.max}</span>
            </div>
          </div>
          
          <div className="bg-dark-900/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30 hover:border-gray-600/50 transition-colors">
            <div className="text-xs text-gray-400 mb-1">CPU</div>
            <div className="text-lg font-bold text-gray-100">
              <span className={server.resources.cpu > 80 ? 'text-neon-pink' : 'text-neon-green'}>
                {server.resources.cpu}%
              </span>
            </div>
          </div>
          
          <div className="bg-dark-900/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30 hover:border-gray-600/50 transition-colors">
            <div className="text-xs text-gray-400 mb-1">Memory</div>
            <div className="text-lg font-bold text-gray-100">
              <span className={server.resources.memory > 80 ? 'text-neon-pink' : 'text-primary-400'}>
                {server.resources.memory}%
              </span>
            </div>
          </div>
          
          <div className="bg-dark-900/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30 hover:border-gray-600/50 transition-colors">
            <div className="text-xs text-gray-400 mb-1">Uptime</div>
            <div className="text-sm font-bold text-gray-100 font-mono">
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
                className="flex items-center space-x-2 px-3 py-2 bg-neon-green/20 hover:bg-neon-green hover:text-dark-950 text-neon-green rounded-lg transition-all duration-200 border border-neon-green/30 hover:border-neon-green text-sm font-medium hover:shadow-lg hover:shadow-neon-green/50"
              >
                <Play className="h-4 w-4" />
                <span>Start</span>
              </button>
            )}
            
            {isRunning && (
              <>
                <button
                  onClick={() => onStop(server.id)}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500 hover:text-white text-red-400 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-500 text-sm font-medium"
                >
                  <Square className="h-4 w-4" />
                  <span>Stop</span>
                </button>
                <button
                  onClick={() => onRestart(server.id)}
                  className="flex items-center space-x-2 px-3 py-2 bg-neon-yellow/20 hover:bg-neon-yellow hover:text-dark-950 text-neon-yellow rounded-lg transition-all duration-200 border border-neon-yellow/30 hover:border-neon-yellow text-sm font-medium"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Restart</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onManage(server.id)}
              className="p-2 text-gray-400 hover:text-neon-cyan transition-colors rounded-lg hover:bg-dark-800/50"
              title="Manage Server"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-neon-purple transition-colors rounded-lg hover:bg-dark-800/50"
              title="View Files"
            >
              <FileText className="h-4 w-4" />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-neon-pink transition-colors rounded-lg hover:bg-dark-800/50"
              title="View Console"
            >
              <Activity className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerCard;