const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://31.97.117.108:3000',
  credentials: true
}));
app.use(express.json());

// Simple in-memory storage
const users = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin', email: 'admin@gamecentral.com' }
];

const servers = [
  {
    id: '1',
    name: 'Minecraft Creative',
    game: 'Minecraft',
    status: 'online',
    players: { current: 24, max: 50 },
    resources: { cpu: 45, memory: 67 },
    uptime: '2d 14h'
  },
  {
    id: '2',
    name: 'CS:GO Competitive', 
    game: 'CS:GO',
    status: 'online',
    players: { current: 18, max: 20 },
    resources: { cpu: 32, memory: 54 },
    uptime: '1d 8h'
  }
];

// Health check
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'OK', service: 'Game Central CP Backend' });
});

// Login
app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body);
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    console.log('Login failed: Invalid credentials');
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  console.log('Login successful for:', username);
  res.json({
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !token.startsWith('mock-jwt-token')) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const user = users[0]; // Return admin user for demo
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  });
});

// Get servers
app.get('/api/servers', (req, res) => {
  console.log('Servers requested');
  res.json(servers);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Game Central CP Backend running on http://31.97.117.108:${PORT}`);
  console.log(`📊 Health check: http://31.97.117.108:${PORT}/health`);
  console.log('✅ Ready to accept connections');
});