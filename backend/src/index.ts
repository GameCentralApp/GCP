import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import compression from 'compression';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient({
  log: ['error'], // Only log errors in production
});
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(compression()); // Enable gzip compression
app.use(cors({
  origin: ['http://31.97.117.108:3000', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
}));
app.use(express.json({ limit: '10mb' })); // Set reasonable limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Simple logging
const log = (message: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }
};

// Health check
app.get('/health', (req: Request, res: Response) => {
  log('Health check requested');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Game Central CP Backend'
  });
});

// Add a GET route for login endpoint to show proper error
app.get('/api/auth/login', (req: Request, res: Response) => {
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
const tokenCache = new Map<string, any>();

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Check cache first
  if (tokenCache.has(token)) {
    (req as any).user = tokenCache.get(token);
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
    (req as any).user = decoded;
    
    // Cache the decoded token for 5 minutes
    tokenCache.set(token, decoded);
    setTimeout(() => tokenCache.delete(token), 5 * 60 * 1000);
    
    return next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Login endpoint
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    log(`POST /api/auth/login - Login attempt for user: ${req.body?.username}`);
    log(`Request body: ${JSON.stringify(req.body)}`);
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
app.get('/api/auth/login', (req: Request, res: Response) => {
  log('GET request to /api/auth/login - this should be a POST request');
  res.status(405).json({ 
    error: 'Method not allowed. Use POST to login.',
    method: req.method,
    expectedMethod: 'POST'
  });
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req: Request, res: Response) => {
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
app.get('/api/servers', authenticateToken, async (req: Request, res: Response) => {
  try {
    log(`Servers requested by user: ${(req as any).user.username}`);
    
    // Optimized mock data with caching
    const servers = [
      {
        id: '1',
        name: 'Minecraft Creative',
        game: 'Minecraft',
        status: 'online',
        players: { current: 24, max: 50 },
        resources: { cpu: 45, memory: 67 },
        uptime: '2d 14h',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '2',
        name: 'CS:GO Competitive',
        game: 'CS:GO',
        status: 'online',
        players: { current: 18, max: 20 },
        resources: { cpu: 32, memory: 54 },
        uptime: '1d 8h',
        lastUpdated: new Date().toISOString()
      }
    ];

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=30'); // Cache for 30 seconds
    return res.json(servers);
  } catch (error) {
    log(`Servers error: ${error}`);
    return res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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