import React, { useState } from 'react';
import { Save, RefreshCw, Shield, Database, Mail, Bell } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'GameHost Control Panel',
      siteDescription: 'Open-source game server management',
      maxServersPerUser: 5,
      defaultMemoryLimit: 2048,
      allowRegistration: true,
      maintenanceMode: false
    },
    docker: {
      dockerHost: '/var/run/docker.sock',
      networkName: 'gamehost-network',
      defaultImage: 'ubuntu:20.04',
      autoCleanup: true,
      imageUpdateInterval: 24
    },
    security: {
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireTwoFactor: false,
      allowApiAccess: true
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      fromAddress: 'noreply@gamehost.com',
      enableNotifications: true
    },
    notifications: {
      serverDown: true,
      highResourceUsage: true,
      userRegistration: false,
      systemUpdates: true,
      backupComplete: true
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'docker', label: 'Docker', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Configure your GameHost control panel</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Settings Interface */}
      <div className="bg-dark-800 border border-gray-700 rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, siteName: e.target.value }
                    }))}
                    className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Servers per User
                  </label>
                  <input
                    type="number"
                    value={settings.general.maxServersPerUser}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, maxServersPerUser: parseInt(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, siteDescription: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Allow User Registration</h4>
                    <p className="text-sm text-gray-400">Allow new users to create accounts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.general.allowRegistration}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, allowRegistration: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Maintenance Mode</h4>
                    <p className="text-sm text-gray-400">Disable access for all users except admins</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.general.maintenanceMode}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, maintenanceMode: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docker' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Docker Host
                  </label>
                  <input
                    type="text"
                    value={settings.docker.dockerHost}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      docker: { ...prev.docker, dockerHost: e.target.value }
                    }))}
                    className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Network Name
                  </label>
                  <input
                    type="text"
                    value={settings.docker.networkName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      docker: { ...prev.docker, networkName: e.target.value }
                    }))}
                    className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Base Image
                </label>
                <input
                  type="text"
                  value={settings.docker.defaultImage}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    docker: { ...prev.docker, defaultImage: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 font-mono"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Auto Cleanup</h4>
                    <p className="text-sm text-gray-400">Automatically remove unused containers and images</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.docker.autoCleanup}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      docker: { ...prev.docker, autoCleanup: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Session Timeout (hours)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Require Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-400">Force all users to enable 2FA</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.requireTwoFactor}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, requireTwoFactor: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Allow API Access</h4>
                    <p className="text-sm text-gray-400">Enable REST API for external integrations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.allowApiAccess}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, allowApiAccess: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {key === 'serverDown' && 'Notify when servers go offline'}
                        {key === 'highResourceUsage' && 'Alert when resource usage is high'}
                        {key === 'userRegistration' && 'Notify when new users register'}
                        {key === 'systemUpdates' && 'Notify about system updates'}
                        {key === 'backupComplete' && 'Notify when backups complete'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { 
                          ...prev.notifications, 
                          [key]: e.target.checked 
                        }
                      }))}
                      className="rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;