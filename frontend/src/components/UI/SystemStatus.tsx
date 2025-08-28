import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface SystemStatusData {
  status: 'online' | 'offline' | 'maintenance';
  docker: {
    connected: boolean;
    containers: number;
  };
  uptime: string;
  load: {
    cpu: number;
    memory: number;
  };
  lastUpdated: string;
}

const SystemStatus: React.FC = () => {
  const [systemData, setSystemData] = useState<SystemStatusData>({
    status: 'online',
    docker: { connected: true, containers: 0 },
    uptime: '0m',
    load: { cpu: 0, memory: 0 },
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStatus = async () => {
    try {
      // Get system health
      const healthResponse = await api.get('/health');
      
      // Get servers to calculate Docker containers
      const serversResponse = await api.get('/servers');
      const onlineServers = serversResponse.data.filter((s: any) => s.status === 'online');
      
      // Calculate uptime from server start time
      const startTime = new Date(healthResponse.data.timestamp);
      const now = new Date();
      const uptimeMs = now.getTime() - startTime.getTime();
      const uptimeHours = Math.floor(uptimeMs / (1000 * 60 * 60));
      const uptimeMinutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
      
      // Calculate average load from online servers
      const avgCpu = onlineServers.length > 0 
        ? Math.round(onlineServers.reduce((sum: number, s: any) => sum + (s.resources?.cpu || 0), 0) / onlineServers.length)
        : 0;
      
      const avgMemory = onlineServers.length > 0
        ? Math.round(onlineServers.reduce((sum: number, s: any) => sum + (s.resources?.memory || 0), 0) / onlineServers.length)
        : 0;

      setSystemData({
        status: healthResponse.data.status === 'OK' ? 'online' : 'offline',
        docker: {
          connected: true,
          containers: onlineServers.length
        },
        uptime: uptimeHours > 0 ? `${uptimeHours}h ${uptimeMinutes}m` : `${uptimeMinutes}m`,
        load: {
          cpu: avgCpu,
          memory: avgMemory
        },
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      setSystemData(prev => ({
        ...prev,
        status: 'offline',
        docker: { connected: false, containers: 0 }
      }));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (systemData.status) {
      case 'online': return 'text-neon-green';
      case 'offline': return 'text-red-400';
      case 'maintenance': return 'text-neon-yellow';
      default: return 'text-gray-400';
    }
  };

  const getStatusDot = () => {
    switch (systemData.status) {
      case 'online': return 'bg-neon-green';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-neon-yellow';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-dark-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
        <div className="animate-pulse">
          <div className="h-4 bg-dark-700 rounded mb-2"></div>
          <div className="space-y-1">
            <div className="h-3 bg-dark-700 rounded"></div>
            <div className="h-3 bg-dark-700 rounded"></div>
            <div className="h-3 bg-dark-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
      <div className="flex items-center space-x-3 mb-3">
        <div className="relative">
          <div className={`w-3 h-3 rounded-full ${getStatusDot()} ${systemData.status === 'online' ? 'animate-pulse' : ''}`}></div>
          {systemData.status === 'online' && (
            <div className="absolute inset-0 w-3 h-3 bg-neon-green rounded-full animate-ping opacity-75"></div>
          )}
        </div>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          System {systemData.status === 'online' ? 'Online' : systemData.status === 'offline' ? 'Offline' : 'Maintenance'}
        </span>
      </div>
      <div className="text-xs text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Docker:</span>
          <span className={systemData.docker.connected ? 'text-neon-green' : 'text-red-400'}>
            {systemData.docker.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Containers:</span>
          <span className="text-gray-300 font-mono">{systemData.docker.containers}</span>
        </div>
        <div className="flex justify-between">
          <span>Uptime:</span>
          <span className="text-gray-300 font-mono">{systemData.uptime}</span>
        </div>
        <div className="flex justify-between">
          <span>CPU Load:</span>
          <span className={`font-mono ${systemData.load.cpu > 80 ? 'text-neon-pink' : 'text-neon-cyan'}`}>
            {systemData.load.cpu}%
          </span>
        </div>
        <div className="flex justify-between">
          <span>Memory:</span>
          <span className={`font-mono ${systemData.load.memory > 80 ? 'text-neon-pink' : 'text-primary-400'}`}>
            {systemData.load.memory}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;