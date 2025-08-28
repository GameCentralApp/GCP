import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('API Configuration:');
console.log('- VITE_API_URL from env:', import.meta.env.VITE_API_URL);
console.log('- Final API_BASE_URL:', API_BASE_URL);
console.log('- Full API URL will be:', `${API_BASE_URL}/api`);

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
  console.log('- Full URL:', `${config.baseURL}${config.url}`);
  console.log('- Headers:', config.headers);
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response SUCCESS:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response ERROR:', error.message);
    console.error('- URL:', error.config?.url);
    console.error('- Method:', error.config?.method);
    console.error('- Status:', error.response?.status);
    console.error('- Response data:', error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);