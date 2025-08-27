import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Server, 
  FileText, 
  Users, 
  Settings, 
  HardDrive,
  Monitor,
  ChevronLeft
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
      'bg-dark-900 border-r border-gray-700 transition-all duration-300 flex flex-col',
      isOpen ? 'w-64' : 'w-16'
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center space-x-2">
              <Monitor className="h-8 w-8 text-primary-500" />
              <span className="font-bold text-xl">GameHost</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-dark-800 transition-colors"
          >
            <ChevronLeft className={clsx('h-5 w-5 transition-transform', !isOpen && 'rotate-180')} />
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
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                    isActive 
                      ? 'bg-primary-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="font-medium animate-fade-in">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* System Status */}
      {isOpen && (
        <div className="p-4 border-t border-gray-700">
          <div className="bg-dark-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">System Online</span>
            </div>
            <div className="text-xs text-gray-400">
              <div>Docker: Connected</div>
              <div>Uptime: 2d 14h 32m</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;