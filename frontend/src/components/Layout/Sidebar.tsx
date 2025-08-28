import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Server, 
  FileText, 
  Users, 
  Settings, 
  Monitor,
  ChevronLeft,
  Zap
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/servers', icon: Server, label: 'Servers' },
  { path: '/templates', icon: FileText, label: 'Templates' },
  { path: '/users', icon: Users, label: 'Users' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  return (
    <div className={clsx(
      'bg-dark-900/50 backdrop-blur-xl border-r border-gray-700/50 transition-all duration-300 flex flex-col relative',
      isOpen ? 'w-64' : 'w-16'
    )}>
      {/* Neon accent line */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neon-cyan via-primary-500 to-neon-purple opacity-60"></div>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-dark-800/50 rounded-lg border border-neon-cyan/30">
                <Zap className="h-5 w-5 text-neon-cyan" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-neon-cyan to-primary-400 bg-clip-text text-transparent">
                  GameHost
                </span>
                <div className="text-xs text-gray-500">Control Panel</div>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-dark-800/50 transition-all duration-200 text-gray-400 hover:text-neon-cyan border border-transparent hover:border-neon-cyan/30"
          >
            <ChevronLeft className={clsx('h-4 w-4 transition-transform duration-300', !isOpen && 'rotate-180')} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={clsx(
                    'flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden',
                    isActive 
                      ? 'bg-gradient-to-r from-primary-600/20 to-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 shadow-lg shadow-neon-cyan/10' 
                      : 'text-gray-400 hover:bg-dark-800/50 hover:text-gray-200 hover:border-gray-600/30 border border-transparent'
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-neon-cyan/10 animate-pulse"></div>
                  )}
                  <Icon className={clsx('h-5 w-5 flex-shrink-0 relative z-10', isActive && 'drop-shadow-lg')} />
                  {isOpen && (
                    <span className="font-medium text-sm animate-fade-in relative z-10">{item.label}</span>
                  )}
                  {isActive && isOpen && (
                    <div className="absolute right-2 w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* System Status */}
      {isOpen && (
        <div className="p-4 border-t border-gray-700/50">
          <div className="bg-dark-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-neon-green rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-sm font-medium text-gray-200">System Online</span>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Docker:</span>
                <span className="text-neon-green">Connected</span>
              </div>
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span className="text-gray-300 font-mono">2d 14h 32m</span>
              </div>
              <div className="flex justify-between">
                <span>Load:</span>
                <span className="text-neon-cyan">45%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;