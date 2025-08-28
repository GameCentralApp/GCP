import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { authenticateToken, requireAdmin } from './middleware/auth';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient({
  log: ['error'], // Only log errors in production
});
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

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
}
)
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

// Basic templates endpoint
app.get('/api/templates', authenticateToken, async (req: Request, res: Response) => {
  try {
    log(`Templates requested by user: ${(req as any).user.username}`);
    
    const templates = [
      {
        id: 'minecraft-vanilla',
        name: 'Minecraft Vanilla',
        description: 'Official Minecraft server with no modifications',
        game: 'Minecraft',
        version: '1.20.4',
        category: 'vanilla',
        downloads: 2847,
        rating: 4.8,
        image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
        requirements: { cpu: '2 cores', memory: '2GB', disk: '1GB' },
        features: ['Easy setup', 'Auto-updates', 'Backup support']
      },
      {
        id: 'csgo-competitive',
        name: 'CS:GO Competitive',
        description: 'Counter-Strike: Global Offensive competitive server setup',
        game: 'CS:GO',
        version: 'Latest',
        category: 'fps',
        downloads: 3421,
        rating: 4.9,
        image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400',
        requirements: { cpu: '2 cores', memory: '1GB', disk: '500MB' },
        features: ['Anti-cheat included', 'Demo recording', 'Tournament ready']
      }
    ];

    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    return res.json(templates);
  } catch (error) {
    log(`Templates error: ${error}`);
    return res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Settings endpoints
app.get('/api/settings', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    log(`Settings requested by admin: ${(req as any).user.username}`);
    
    const settings = await prisma.setting.findMany();
    
    // Convert to nested object structure
    const settingsObj = {
      general: {
        siteName: 'GameHost Control Panel',
        siteDescription: 'Open-source game server management',
        maxServersPerUser: 5,
        defaultMemoryLimit: 2048,
        allowRegistration: true,
        maintenanceMode: false
      },
      docker: {
        dockerHost: '/var/run/docker.sock',
        networkName: 'gamehost-network',
        defaultImage: 'ubuntu:20.04',
        autoCleanup: true,
        imageUpdateInterval: 24
      },
      security: {
        sessionTimeout: 24,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireTwoFactor: false,
        allowApiAccess: true
      },
      notifications: {
        serverDown: true,
        highResourceUsage: true,
        userRegistration: false,
        systemUpdates: true,
        backupComplete: true
      }
    };

    // Override with database values
    settings.forEach(setting => {
      const keys = setting.key.split('.');
      if (keys.length === 2) {
        const [section, key] = keys;
        if (settingsObj[section]) {
          let value: any = setting.value;
          if (setting.type === 'boolean') {
            value = setting.value === 'true';
          } else if (setting.type === 'number') {
            value = parseFloat(setting.value);
          }
          settingsObj[section][key] = value;
        }
      }
    });

    return res.json(settingsObj);
  } catch (error) {
    log(`Settings error: ${error}`);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    log(`Settings update by admin: ${(req as any).user.username}`);
    const updates = req.body;
    
    // Flatten nested settings object
    const flatSettings: Record<string, any> = {};
    Object.keys(updates).forEach(section => {
      Object.keys(updates[section]).forEach(key => {
        flatSettings[`${section}.${key}`] = updates[section][key];
      });
    });
    
    // Update each setting
    for (const [key, value] of Object.entries(flatSettings)) {
      const type = typeof value === 'boolean' ? 'boolean' :
                   typeof value === 'number' ? 'number' : 'string';
      
      const stringValue = String(value);
      
      await prisma.setting.upsert({
        where: { key },
        update: { value: stringValue, type },
        create: { key, value: stringValue, type }
      });
    }

    log(`Settings updated successfully`);
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    log(`Error updating settings: ${error}`);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

app.post('/api/settings/reset', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    log(`Settings reset by admin: ${(req as any).user.username}`);
    
    // Delete all custom settings
    await prisma.setting.deleteMany();
    
    log(`Settings reset to defaults`);
    res.json({ message: 'Settings reset to defaults' });
  } catch (error) {
    log(`Error resetting settings: ${error}`);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
});

// Basic users endpoint (admin only)
app.get('/api/users', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    log(`Users requested by admin: ${(req as any).user.username}`);
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        lastActive: true,
        createdAt: true,
        _count: { select: { servers: true } }
      }
    });

    return res.json(users);
  } catch (error) {
    log(`Users error: ${error}`);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create user (admin only)
app.post('/api/users', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || 'user'
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        lastActive: true,
        createdAt: true
      }
    });

    log(`User created: ${username} by admin: ${(req as any).user.username}`);
    return res.status(201).json(user);
  } catch (error) {
    log(`Error creating user: ${error}`);
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user (admin only)
app.put('/api/users/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, role, password } = req.body;

    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        lastActive: true,
        createdAt: true
      }
    });

    log(`User updated: ${user.username} by admin: ${(req as any).user.username}`);
    return res.json(user);
  } catch (error) {
    log(`Error updating user: ${error}`);
    return res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (admin only)
app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    // Prevent admin from deleting themselves
    if (id === currentUser.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Get user info before deletion
    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: { username: true }
    });

    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.user.delete({ where: { id } });

    log(`User deleted: ${userToDelete.username} by admin: ${currentUser.username}`);
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    log(`Error deleting user: ${error}`);
    return res.status(500).json({ error: 'Failed to delete user' });
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