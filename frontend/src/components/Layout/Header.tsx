import React from 'react';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-dark-900 border-b border-gray-700 h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-dark-800 transition-colors lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <h1 className="text-xl font-semibold text-white">
          Control Panel
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-dark-800 transition-colors group">
          <Bell className="h-5 w-5 text-gray-300 group-hover:text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dark-800">
            <User className="h-4 w-4 text-gray-300" />
            <span className="text-sm text-gray-300">{user?.username}</span>
            <span className={clsx(
              'px-2 py-1 text-xs rounded-full',
              user?.role === 'admin' ? 'bg-red-600 text-white' :
              user?.role === 'user' ? 'bg-blue-600 text-white' :
              'bg-gray-600 text-white'
            )}>
              {user?.role}
            </span>
          </div>
          
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-dark-800 transition-colors group"
            title="Logout"
          >
            <LogOut className="h-5 w-5 text-gray-300 group-hover:text-red-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;