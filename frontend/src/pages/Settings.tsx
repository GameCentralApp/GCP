import React from 'react';
import { Save } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Configure your Game Central CP</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-dark-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Site Name
            </label>
            <input
              type="text"
              defaultValue="Game Central CP"
              className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Servers per User
            </label>
            <input
              type="number"
              defaultValue="5"
              className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;