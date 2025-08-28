import React from 'react';
import { Download } from 'lucide-react';

const Templates: React.FC = () => {
  const templates = [
    {
      id: '1',
      name: 'Minecraft Vanilla',
      description: 'Official Minecraft server',
      game: 'Minecraft',
      downloads: 2847
    },
    {
      id: '2', 
      name: 'CS:GO Competitive',
      description: 'Counter-Strike server setup',
      game: 'CS:GO',
      downloads: 3421
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Game Templates</h1>
        <p className="text-gray-400">Pre-configured game server templates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-dark-800 border border-gray-700 rounded-lg p-6">
            <h3 className="font-semibold text-white mb-2">{template.name}</h3>
            <p className="text-gray-300 text-sm mb-4">{template.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-gray-400">
                <Download className="h-4 w-4" />
                <span className="text-sm">{template.downloads.toLocaleString()}</span>
              </div>
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors text-sm">
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;