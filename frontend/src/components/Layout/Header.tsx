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
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        
        <h1 className="text-lg font-medium text-gray-900">
          Control Panel
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group">
          <Bell className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100">
            <User className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">{user?.username}</span>
            <span className={clsx(
              'px-2 py-1 text-xs rounded-full font-medium',
              user?.role === 'admin' ? 'bg-red-100 text-red-700' :
              user?.role === 'user' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-200 text-gray-700'
            )}>
              {user?.role}
            </span>
          </div>
          
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            title="Logout"
          >
            <LogOut className="h-5 w-5 text-gray-500 group-hover:text-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;