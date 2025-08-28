import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Servers from './pages/Servers';
import ServerDetails from './pages/ServerDetails';
import Templates from './pages/Templates';
import FileManager from './pages/FileManager';
import Users from './pages/Users';
import Settings from './pages/Settings';
import LoadingScreen from './components/UI/LoadingScreen';

function App() {
  const { isLoading, user } = useAuth();

  console.log('App render - isLoading:', isLoading, 'user:', user);

  if (isLoading) {
    console.log('Showing loading screen');
    return <LoadingScreen />;
  }

  if (!user) {
    console.log('No user, showing login');
    return <Login />;
  }

  console.log('User authenticated, showing main app');
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/servers" element={<Servers />} />
        <Route path="/servers/:id" element={<ServerDetails />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/files/:serverId" element={<FileManager />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;