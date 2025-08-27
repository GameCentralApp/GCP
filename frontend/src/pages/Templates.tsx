import React, { useState } from 'react';
import { Plus, Download, Star, Users, HardDrive, Clock } from 'lucide-react';
import clsx from 'clsx';

const Templates: React.FC = () => {
  const [templates] = useState([
    {
      id: '1',
      name: 'Minecraft Vanilla',
      description: 'Official Minecraft server with no modifications',
      game: 'Minecraft',
      version: '1.20.4',
      category: 'vanilla',
      downloads: 2847,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      requirements: {
        cpu: '2 cores',
        memory: '2GB',
        disk: '1GB'
      },
      features: ['Easy setup', 'Auto-updates', 'Backup support']
    },
    {
      id: '2',
      name: 'Minecraft Modded (Forge)',
      description: 'Minecraft server with Forge mod loader pre-installed',
      game: 'Minecraft',
      version: '1.20.1',
      category: 'modded',
      downloads: 1923,
      rating: 4.6,
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
      requirements: {
        cpu: '4 cores',
        memory: '4GB',
        disk: '2GB'
      },
      features: ['Forge pre-installed', 'Mod management', 'Performance optimized']
    },
    {
      id: '3',
      name: 'CS:GO Competitive',
      description: 'Counter-Strike: Global Offensive competitive server setup',
      game: 'CS:GO',
      version: 'Latest',
      category: 'fps',
      downloads: 3421,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400',
      requirements: {
        cpu: '2 cores',
        memory: '1GB',
        disk: '500MB'
      },
      features: ['Anti-cheat included', 'Demo recording', 'Tournament ready']
    },
    {
      id: '4',
      name: 'Rust Vanilla',
      description: 'Official Rust server with standard gameplay',
      game: 'Rust',
      version: 'Latest',
      category: 'survival',
      downloads: 1567,
      rating: 4.5,
      image: 'https://images.pexels.com/photos/1314544/pexels-photo-1314544.jpeg?auto=compress&cs=tinysrgb&w=400',
      requirements: {
        cpu: '4 cores',
        memory: '8GB',
        disk: '5GB'
      },
      features: ['Auto-wipe support', 'Admin tools', 'Performance monitoring']
    },
    {
      id: '5',
      name: 'Garry\'s Mod DarkRP',
      description: 'Popular roleplay gamemode for Garry\'s Mod',
      game: "Garry's Mod",
      version: 'Latest',
      category: 'roleplay',
      downloads: 2134,
      rating: 4.7,
      image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400',
      requirements: {
        cpu: '2 cores',
        memory: '2GB',
        disk: '1GB'
      },
      features: ['DarkRP pre-configured', 'Admin system', 'Custom jobs']
    },
    {
      id: '6',
      name: 'Valheim Dedicated',
      description: 'Dedicated Valheim server for Viking adventures',
      game: 'Valheim',
      version: 'Latest',
      category: 'survival',
      downloads: 892,
      rating: 4.4,
      image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=400',
      requirements: {
        cpu: '2 cores',
        memory: '2GB',
        disk: '1GB'
      },
      features: ['World backup', 'Password protection', 'BepInEx support']
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['all', 'vanilla', 'modded', 'fps', 'survival', 'roleplay'];

  const filteredTemplates = templates.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  const handleUseTemplate = (templateId: string) => {
    // Navigate to server creation with template
    window.location.href = `/servers/create?template=${templateId}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Game Templates</h1>
        <p className="text-gray-400">Pre-configured game server templates for quick deployment</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium text-sm transition-colors capitalize',
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-dark-800 border border-gray-700 rounded-lg overflow-hidden hover:border-primary-500 transition-colors group">
            {/* Template Image */}
            <div className="h-48 bg-gray-700 overflow-hidden">
              <img 
                src={template.image} 
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Template Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-400">{template.game} • {template.version}</p>
                </div>
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="h-4 w-4" />
                  <span className="text-sm">{template.rating}</span>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{template.description}</p>

              {/* Requirements */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-xs text-gray-400">CPU</div>
                  <div className="text-sm font-medium text-white">{template.requirements.cpu}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Memory</div>
                  <div className="text-sm font-medium text-white">{template.requirements.memory}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Disk</div>
                  <div className="text-sm font-medium text-white">{template.requirements.disk}</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-primary-900/30 text-primary-300 text-xs rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-gray-400">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">{template.downloads.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors text-sm font-medium"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Custom Template */}
      <div className="bg-dark-800 border border-gray-700 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Need a Custom Template?</h3>
        <p className="text-gray-400 mb-4">
          Create your own game server template with custom configurations and settings
        </p>
        <button className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors mx-auto">
          <Plus className="h-4 w-4" />
          <span>Create Custom Template</span>
        </button>
      </div>
    </div>
  );
};

export default Templates;