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
      'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
      isOpen ? 'w-64' : 'w-16'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center space-x-2">
              <Monitor className="h-6 w-6 text-gray-900" />
              <span className="font-semibold text-lg text-gray-900">GameHost</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className={clsx('h-4 w-4 text-gray-600 transition-transform', !isOpen && 'rotate-180')} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={clsx(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group',
                    isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {isOpen && (
                    <span className="font-medium text-sm animate-fade-in">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* System Status */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-700">System Online</span>
            </div>
            <div className="text-xs text-gray-500">
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