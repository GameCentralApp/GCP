import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://31.97.117.108:5000';

console.log('API Configuration:');
console.log('- VITE_API_URL from env:', import.meta.env.VITE_API_URL);
console.log('- Final API_BASE_URL:', API_BASE_URL);
console.log('- Full API URL will be:', `${API_BASE_URL}/api`);

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 5000, // Reduced timeout for faster failure detection
  headers: {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br', // Enable compression
  },
  // Enable request/response compression
  decompress: true,
});

// Request cache for GET requests
const requestCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Only log in development
  if (import.meta.env.DEV) {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    console.log('- Full URL:', `${config.baseURL}${config.url}`);
    console.log('- Headers:', config.headers);
  }
  
  // Check cache for GET requests
  if (config.method === 'get' && config.url) {
    const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
    const cached = requestCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return Promise.resolve({ ...config, data: cached.data, cached: true });
    }
  }
  
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => {
    // Cache GET responses
    if (response.config.method === 'get' && response.config.url) {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    
    if (import.meta.env.DEV) {
      console.log('API Response SUCCESS:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('API Response ERROR:', error.message);
      console.error('- URL:', error.config?.url);
      console.error('- Method:', error.config?.method);
      console.error('- Status:', error.response?.status);
      console.error('- Response data:', error.response?.data);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);