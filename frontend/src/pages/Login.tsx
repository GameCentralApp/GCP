import React, { useState } from 'react';
import { Monitor } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(username, password);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0f172a' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Monitor size={64} color="#3b82f6" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">GameHost</h1>
          <p className="text-gray-400">Control Panel</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2" style={{ display: 'block' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2" style={{ display: 'block' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fecaca',
                borderRadius: '0.375rem',
                color: '#dc2626'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`btn w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : 'btn-primary'}`}
              style={{ width: '100%' }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={{ 
            marginTop: '1.5rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid #374151' 
          }}>
            <p className="text-sm text-gray-400 text-center mb-2">Demo Credentials:</p>
            <div className="text-sm text-gray-300">
              <div>Username: <code style={{ backgroundColor: '#0f172a', padding: '0.25rem', borderRadius: '0.25rem' }}>admin</code></div>
              <div>Password: <code style={{ backgroundColor: '#0f172a', padding: '0.25rem', borderRadius: '0.25rem' }}>admin123</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;