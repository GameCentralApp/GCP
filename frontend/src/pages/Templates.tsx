import React, { useState } from 'react';
import { Plus, Download, Star, Users, HardDrive, Clock } from 'lucide-react';
import { api } from '../services/api';
import clsx from 'clsx';

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['all', 'vanilla', 'modded', 'fps', 'survival', 'roleplay'];

  React.useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

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
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-dark-800 border border-gray-700 rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-700"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                <div className="h-16 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
                    <span className="text-sm">{template.rating || 4.5}</span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{template.description}</p>

                {/* Requirements */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">CPU</div>
                    <div className="text-sm font-medium text-white">
                      {template.requirements?.cpu || '2 cores'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Memory</div>
                    <div className="text-sm font-medium text-white">
                      {template.requirements?.memory || '2GB'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Disk</div>
                    <div className="text-sm font-medium text-white">
                      {template.requirements?.disk || '1GB'}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {(template.features || ['Easy setup', 'Auto-updates', 'Backup support']).map((feature, index) => (
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
                    <span className="text-sm">{(template.downloads || 0).toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => handleUseTemplate(template.id)}
                    className="px-4 py-2 bg-neon-cyan/20 hover:bg-neon-cyan hover:text-dark-950 text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan rounded-lg transition-colors text-sm font-medium"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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