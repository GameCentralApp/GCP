const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://31.97.117.108:3000', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Simple logging
const log = (message: string) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// Health check
app.get('/health', (req: express.Request, res: express.Response) => {
  log('Health check requested');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Game Central CP Backend'
  });
});

// Add a GET route for login endpoint to show proper error
app.get('/api/auth/login', (req: express.Request, res: express.Response) => {
  log('GET request to login endpoint - should be POST');
  res.status(405).json({ 
    error: 'Method not allowed. Use POST for login.',
    method: 'POST',
    endpoint: '/api/auth/login',
    message: 'This endpoint only accepts POST requests with username and password in the request body',
    body: {
      username: 'string',
      password: 'string'
    }
  });
});

// Auth middleware
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Login endpoint
app.post('/api/auth/login', async (req: express.Request, res: express.Response) => {
  try {
    log(`POST /api/auth/login - Login attempt for user: ${req.body?.username}`);
    log(`Request body:`, JSON.stringify(req.body));
    const { username, password } = req.body;

    if (!username || !password) {
      log('Login failed: Missing username or password');
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      log(`Login failed: User ${username} not found`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      log(`Login failed: Invalid password for user ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    log(`Login successful for user: ${username}`);

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    log(`Login error: ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle GET request to login endpoint (for debugging)
app.get('/api/auth/login', (req, res) => {
  log('GET request to /api/auth/login - this should be a POST request');
  res.status(405).json({ 
    error: 'Method not allowed. Use POST to login.',
    method: req.method,
    expectedMethod: 'POST'
  });
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req: express.Request, res: express.Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    log(`Get user error: ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Basic servers endpoint
app.get('/api/servers', authenticateToken, async (req: express.Request, res: express.Response) => {
  try {
    log(`Servers requested by user: ${(req as any).user.username}`);
    
    // Mock data for now
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

    return res.json(servers);
  } catch (error) {
    log(`Servers error: ${error}`);
    return res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  log(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// Database connection and server startup
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    log('Connected to database successfully');

    // Create admin user if it doesn't exist
    try {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.user.upsert({
        where: { username: 'admin' },
        update: {
          password: hashedPassword,
          role: 'admin'
        },
        create: {
          username: 'admin',
          email: 'admin@gamecentral.com',
          password: hashedPassword,
          role: 'admin'
        }
      });
      log('Admin user ready');
    } catch (error) {
      log(`Admin user setup error: ${error}`);
    }

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      log(`Game Central CP Backend running on port ${PORT}`);
      log(`Health check: http://31.97.117.108:${PORT}/health`);
      log(`API Base: http://31.97.117.108:${PORT}/api`);
      log('Server is ready to accept connections');
    });
  } catch (error) {
    log(`Failed to start server: ${error}`);
    process.exit(1);
  }
}

startServer();