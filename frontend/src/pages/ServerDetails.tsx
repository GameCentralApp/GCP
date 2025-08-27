import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Settings, 
  FileText, 
  Activity, 
  Users,
  HardDrive,
  Network,
  AlertCircle,
  ArrowLeft,
  Terminal
} from 'lucide-react';
import { Line, ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const ServerDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [server, setServer] = useState({
    id: id || '1',
    name: 'Minecraft Creative',
    game: 'Minecraft',
    status: 'online' as const,
    players: { current: 24, max: 50 },
    resources: { cpu: 45, memory: 67, disk: 34 },
    uptime: '2d 14h 32m',
    ip: '192.168.1.100',
    port: 25565,
    version: '1.20.4',
    description: 'Creative building server with custom plugins'
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [consoleOutput, setConsoleOutput] = useState([
    '[10:30:25] [Server thread/INFO]: Server startup complete',
    '[10:30:26] [User Authenticator #1/INFO]: UUID of player Steve is 069a79f4-44e9-4726-a5be-fca90e38aaf5',
    '[10:30:26] [Server thread/INFO]: Steve joined the game',
    '[10:30:45] [Server thread/INFO]: [Steve: Set own game mode to Creative Mode]',
    '[10:31:12] [Server thread/INFO]: Player Alex joined',
  ]);
  const [consoleCommand, setConsoleCommand] = useState('');

  const [performanceData] = useState([
    { time: '10:25', cpu: 35, memory: 62, network: 15 },
    { time: '10:26', cpu: 42, memory: 65, network: 18 },
    { time: '10:27', cpu: 38, memory: 64, network: 22 },
    { time: '10:28', cpu: 45, memory: 67, network: 19 },
    { time: '10:29', cpu: 41, memory: 66, network: 16 },
    { time: '10:30', cpu: 45, memory: 67, network: 20 },
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'console', label: 'Console', icon: Terminal },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleServerAction = async (action: string) => {
    try {
      if (action === 'start') {
        setServer(prev => ({ ...prev, status: 'starting' }));
        setTimeout(() => {
          setServer(prev => ({ ...prev, status: 'online' }));
          toast.success('Server started successfully');
        }, 2000);
      } else if (action === 'stop') {
        setServer(prev => ({ ...prev, status: 'stopping' }));
        setTimeout(() => {
          setServer(prev => ({ 
            ...prev, 
            status: 'offline',
            resources: { ...prev.resources, cpu: 0, memory: 0 }
          }));
          toast.success('Server stopped successfully');
        }, 1500);
      } else if (action === 'restart') {
        setServer(prev => ({ ...prev, status: 'stopping' }));
        setTimeout(() => {
          setServer(prev => ({ ...prev, status: 'starting' }));
          setTimeout(() => {
            setServer(prev => ({ ...prev, status: 'online' }));
            toast.success('Server restarted successfully');
          }, 2000);
        }, 1500);
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleConsoleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleCommand.trim()) return;
    
    const newOutput = `[${new Date().toLocaleTimeString()}] [Server thread/INFO]: ${consoleCommand}`;
    setConsoleOutput(prev => [...prev, newOutput]);
    setConsoleCommand('');
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    starting: 'bg-yellow-500 animate-pulse',
    stopping: 'bg-orange-500 animate-pulse'
  };

  const isRunning = server.status === 'online';
  const isTransitioning = server.status === 'starting' || server.status === 'stopping';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/servers')}
            className="p-2 rounded-lg hover:bg-dark-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{server.name}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-gray-400">{server.game} • {server.version}</span>
              <div className="flex items-center space-x-2">
                <div className={clsx('w-2 h-2 rounded-full', statusColors[server.status])}></div>
                <span className="text-sm text-gray-300 capitalize">{server.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {!isRunning && !isTransitioning && (
            <button
              onClick={() => handleServerAction('start')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>Start</span>
            </button>
          )}
          
          {isRunning && (
            <>
              <button
                onClick={() => handleServerAction('restart')}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Restart</span>
              </button>
              <button
                onClick={() => handleServerAction('stop')}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <Square className="h-4 w-4" />
                <span>Stop</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Server Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Players Online</p>
              <p className="text-2xl font-bold text-white">
                {server.players.current}/{server.players.max}
              </p>
            </div>
            <Users className="h-8 w-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-dark-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">CPU Usage</p>
              <p className="text-2xl font-bold text-white">{server.resources.cpu}%</p>
            </div>
            <Activity className="h-8 w-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-dark-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Memory</p>
              <p className="text-2xl font-bold text-white">{server.resources.memory}%</p>
            </div>
            <HardDrive className="h-8 w-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-dark-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Network</p>
              <p className="text-2xl font-bold text-white">45 MB/s</p>
            </div>
            <Network className="h-8 w-8 text-primary-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-dark-800 border border-gray-700 rounded-lg">
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

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Performance Chart */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        color: '#fff'
                      }} 
                    />
                    <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} name="CPU %" />
                    <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} name="Memory %" />
                    <Line type="monotone" dataKey="network" stroke="#F59E0B" strokeWidth={2} name="Network MB/s" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Server Configuration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Server Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">IP Address</span>
                      <span className="text-white font-mono">{server.ip}:{server.port}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Game Version</span>
                      <span className="text-white">{server.version}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Uptime</span>
                      <span className="text-white">{server.uptime}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Description</span>
                      <span className="text-white text-right">{server.description}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Resource Usage</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">CPU</span>
                        <span className="text-white">{server.resources.cpu}%</span>
                      </div>
                      <div className="w-full bg-dark-900 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${server.resources.cpu}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Memory</span>
                        <span className="text-white">{server.resources.memory}%</span>
                      </div>
                      <div className="w-full bg-dark-900 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${server.resources.memory}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Disk</span>
                        <span className="text-white">{server.resources.disk}%</span>
                      </div>
                      <div className="w-full bg-dark-900 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${server.resources.disk}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'console' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Server Console</h3>
              
              {/* Console Output */}
              <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto console-output">
                <div className="space-y-1">
                  {consoleOutput.map((line, index) => (
                    <div key={index} className="text-green-400 text-sm font-mono">
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* Command Input */}
              <form onSubmit={handleConsoleCommand} className="flex space-x-2">
                <input
                  type="text"
                  value={consoleCommand}
                  onChange={(e) => setConsoleCommand(e.target.value)}
                  placeholder="Enter server command..."
                  className="flex-1 px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 font-mono"
                  disabled={!isRunning}
                />
                <button
                  type="submit"
                  disabled={!isRunning || !consoleCommand.trim()}
                  className={clsx(
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    isRunning && consoleCommand.trim()
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  )}
                >
                  Send
                </button>
              </form>

              {!isRunning && (
                <div className="flex items-center space-x-2 text-yellow-400 bg-yellow-900/20 border border-yellow-600 rounded-lg p-3">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">Console is only available when the server is running</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">File Manager</h3>
                <button
                  onClick={() => navigate(`/files/${server.id}`)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors text-sm"
                >
                  Open File Manager
                </button>
              </div>
              
              <div className="bg-dark-900 rounded-lg p-4">
                <p className="text-gray-400 text-center py-8">
                  Click "Open File Manager" to access the full file management interface
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Server Settings</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Server Name
                    </label>
                    <input
                      type="text"
                      value={server.name}
                      className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={server.description}
                      rows={3}
                      className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Players
                    </label>
                    <input
                      type="number"
                      value={server.players.max}
                      className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Server Port
                    </label>
                    <input
                      type="number"
                      value={server.port}
                      className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Memory Limit (GB)
                    </label>
                    <input
                      type="number"
                      defaultValue="4"
                      className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CPU Limit (%)
                    </label>
                    <input
                      type="number"
                      defaultValue="80"
                      className="w-full px-3 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerDetails;