import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';

console.log('Frontend starting...');
console.log('API URL:', import.meta.env.VITE_API_URL);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'bg-dark-800 text-white border border-gray-700',
            duration: 4000,
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);