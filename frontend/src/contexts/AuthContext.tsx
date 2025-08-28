import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Cache user data
let userCache: User | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, user not authenticated');
      setIsLoading(false);
      return;
    }

    // Check cache first
    const now = Date.now();
    if (userCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Using cached user data');
      setUser(userCache);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Checking authentication with token:', token.substring(0, 20) + '...');
      const response = await api.get('/auth/me');
      console.log('Auth check successful:', response.data);
      
      // Update cache
      userCache = response.data;
      cacheTimestamp = now;
      
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      userCache = null;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      console.log('Attempting login for user:', username);
      console.log('Making POST request to /api/auth/login');
      const response = await api.post('/auth/login', { 
        username, 
        password 
      });
      console.log('Login response:', response.data);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      // Update cache
      userCache = user;
      cacheTimestamp = Date.now();
      
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      if ((error as any).response) {
        console.error('Response status:', (error as any).response.status);
        console.error('Response data:', (error as any).response.data);
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    userCache = null;
    cacheTimestamp = 0;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};