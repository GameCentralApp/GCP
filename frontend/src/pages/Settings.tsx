import React, { useState } from 'react';
import { Save, RefreshCw, Shield, Database, Mail, Bell } from 'lucide-react';
import clsx from 'clsx';
import { Settings as SettingsIcon } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
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
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'docker', label: 'Docker', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings');
      if (response.data) {
        setSettings(prevSettings => ({
          ...prevSettings,
          ...response.data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.put('/settings', settings);
      setHasChanges(false);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await api.post('/settings/reset');
      await fetchSettings(); // Reload settings after reset
      setHasChanges(false);
      toast.success('Settings reset to defaults');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      toast.error('Failed to reset settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
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
          <button 
            onClick={handleReset}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !hasChanges}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
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
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'cursor-pointer',
                    'flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-neon-cyan text-neon-cyan'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </div>
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
                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
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
                    onChange={(e) => updateSetting('general', 'maxServersPerUser', parseInt(e.target.value))}
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
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-gray-700/30">
                  <div>
                    <h4 className="font-medium text-white">Allow User Registration</h4>
                    <p className="text-sm text-gray-400">Allow new users to create accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.general.allowRegistration}
                      onChange={(e) => updateSetting('general', 'allowRegistration', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={clsx(
                      'w-11 h-6 rounded-full transition-colors',
                      settings.general.allowRegistration ? 'bg-neon-cyan' : 'bg-gray-600'
                    )}>
                      <div className={clsx(
                        'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5',
                        settings.general.allowRegistration ? 'translate-x-5' : 'translate-x-0.5'
                      )}></div>
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-gray-700/30">
                  <div>
                    <h4 className="font-medium text-white">Maintenance Mode</h4>
                    <p className="text-sm text-gray-400">Disable access for all users except admins</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.general.maintenanceMode}
                      onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={clsx(
                      'w-11 h-6 rounded-full transition-colors',
                      settings.general.maintenanceMode ? 'bg-neon-pink' : 'bg-gray-600'
                    )}>
                      <div className={clsx(
                        'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5',
                        settings.general.maintenanceMode ? 'translate-x-5' : 'translate-x-0.5'
                      )}></div>
                    </div>
                  </label>
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
                    onChange={(e) => updateSetting('docker', 'dockerHost', e.target.value)}
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
                    onChange={(e) => updateSetting('docker', 'networkName', e.target.value)}
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
                  onChange={(e) => updateSetting('docker', 'defaultImage', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 font-mono"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-gray-700/30">
                  <div>
                    <h4 className="font-medium text-white">Auto Cleanup</h4>
                    <p className="text-sm text-gray-400">Automatically remove unused containers and images</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.docker.autoCleanup}
                      onChange={(e) => updateSetting('docker', 'autoCleanup', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={clsx(
                      'w-11 h-6 rounded-full transition-colors',
                      settings.docker.autoCleanup ? 'bg-neon-green' : 'bg-gray-600'
                    )}>
                      <div className={clsx(
                        'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5',
                        settings.docker.autoCleanup ? 'translate-x-5' : 'translate-x-0.5'
                      )}></div>
                    </div>
                  </label>
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
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
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
                    onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-gray-700/30">
                  <div>
                    <h4 className="font-medium text-white">Require Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-400">Force all users to enable 2FA</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.requireTwoFactor}
                      onChange={(e) => updateSetting('security', 'requireTwoFactor', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={clsx(
                      'w-11 h-6 rounded-full transition-colors',
                      settings.security.requireTwoFactor ? 'bg-neon-purple' : 'bg-gray-600'
                    )}>
                      <div className={clsx(
                        'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5',
                        settings.security.requireTwoFactor ? 'translate-x-5' : 'translate-x-0.5'
                      )}></div>
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-gray-700/30">
                  <div>
                    <h4 className="font-medium text-white">Allow API Access</h4>
                    <p className="text-sm text-gray-400">Enable REST API for external integrations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.allowApiAccess}
                      onChange={(e) => updateSetting('security', 'allowApiAccess', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={clsx(
                      'w-11 h-6 rounded-full transition-colors',
                      settings.security.allowApiAccess ? 'bg-neon-cyan' : 'bg-gray-600'
                    )}>
                      <div className={clsx(
                        'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5',
                        settings.security.allowApiAccess ? 'translate-x-5' : 'translate-x-0.5'
                      )}></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg border border-gray-700/30">
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
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                        className="sr-only"
                      />
                      <div className={clsx(
                        'w-11 h-6 rounded-full transition-colors',
                        enabled ? 'bg-neon-green' : 'bg-gray-600'
                      )}>
                        <div className={clsx(
                          'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5',
                          enabled ? 'translate-x-5' : 'translate-x-0.5'
                        )}></div>
                      </div>
                    </label>
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