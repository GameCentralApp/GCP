import React from 'react';
import { Bell, User, LogOut, Menu, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-dark-900/50 backdrop-blur-xl border-b border-gray-700/50 h-16 flex items-center justify-between px-6 relative">
      {/* Neon accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-30"></div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-dark-800/50 transition-all duration-200 lg:hidden text-gray-400 hover:text-neon-cyan border border-transparent hover:border-neon-cyan/30"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-3">
          <Zap className="h-5 w-5 text-neon-cyan" />
          <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
            Control Panel
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-dark-800/50 transition-all duration-200 group border border-transparent hover:border-gray-600/30">
          <Bell className="h-5 w-5 text-gray-400 group-hover:text-neon-cyan transition-colors" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full animate-pulse shadow-lg shadow-neon-pink/50"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-dark-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
            <div className="p-1 bg-dark-700/50 rounded-full">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-200">{user?.username}</span>
              <span className={clsx(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                user?.role === 'admin' ? 'bg-neon-pink/20 text-neon-pink' :
                user?.role === 'user' ? 'bg-primary-500/20 text-primary-400' :
                'bg-gray-600/20 text-gray-400'
              )}>
                {user?.role}
              </span>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-red-900/20 transition-all duration-200 group border border-transparent hover:border-red-500/30"
            title="Logout"
          >
            <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;