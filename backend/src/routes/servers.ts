import express from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

const router = express.Router();

// Get all servers
router.get('/', async (req, res) => {
  try {
    const user = (req as any).user;
    
    // Mock server data for now
    const servers = [
      {
        id: '1',
        name: 'Minecraft Creative',
        game: 'Minecraft',
        status: 'online',
        players: { current: 24, max: 50 },
        resources: { cpu: 45, memory: 67 },
        uptime: '2d 14h',
        user: { username: user.username }
      },
      {
        id: '2',
        name: 'CS:GO Competitive',
        game: 'CS:GO',
        status: 'online',
        players: { current: 18, max: 20 },
        resources: { cpu: 32, memory: 54 },
        uptime: '1d 8h',
        user: { username: user.username }
      }
    ];

    return res.json(servers);
  } catch (error) {
    logger.error('Error fetching servers:', error);
    return res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

// Create server
router.post('/', async (req, res) => {
  try {
    const user = (req as any).user;
    const { name, game, template, port, memory, cpu } = req.body;

    // Mock server creation
    const server = {
      id: Date.now().toString(),
      name,
      game,
      template,
      port,
      memory,
      cpu,
      status: 'offline',
      userId: user.userId
    };

    return res.status(201).json(server);
  } catch (error) {
    logger.error('Error creating server:', error);
    return res.status(500).json({ error: 'Failed to create server' });
  }
});

// Get server details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    // Mock server details
    const server = {
      id,
      name: 'Minecraft Creative',
      game: 'Minecraft',
      status: 'online',
      players: { current: 24, max: 50 },
      resources: { cpu: 45, memory: 67 },
      uptime: '2d 14h',
      user: { username: user.username }
    };

    return res.json(server);
  } catch (error) {
    logger.error('Error fetching server:', error);
    return res.status(500).json({ error: 'Failed to fetch server' });
  }
});

// Start server
router.post('/:id/start', async (req, res) => {
  try {
    const { id } = req.params;
    return res.json({ message: 'Server start initiated' });
  } catch (error) {
    logger.error('Error starting server:', error);
    return res.status(500).json({ error: 'Failed to start server' });
  }
});

// Stop server
router.post('/:id/stop', async (req, res) => {
  try {
    const { id } = req.params;
    return res.json({ message: 'Server stop initiated' });
  } catch (error) {
    logger.error('Error stopping server:', error);
    return res.status(500).json({ error: 'Failed to stop server' });
  }
});

// Restart server
router.post('/:id/restart', async (req, res) => {
  try {
    const { id } = req.params;
    return res.json({ message: 'Server restart initiated' });
  } catch (error) {
    logger.error('Error restarting server:', error);
    return res.status(500).json({ error: 'Failed to restart server' });
  }
});

// Delete server
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    return res.json({ message: 'Server deleted successfully' });
  } catch (error) {
    logger.error('Error deleting server:', error);
    return res.status(500).json({ error: 'Failed to delete server' });
  }
});

export default router;
    });

    // Create Docker container
    const containerId = await serverManager.createServer(server);
    
    // Update server with container ID
    const updatedServer = await prisma.server.update({
      where: { id: server.id },
      data: { containerId }
    });

    return res.status(201).json(updatedServer);
  } catch (error) {
    logger.error('Error creating server:', error);
    return res.status(500).json({ error: 'Failed to create server' });
  }
});

// Get server details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const server = await prisma.server.findFirst({
      where: {
        id,
        ...(user.role === 'admin' ? {} : { userId: user.userId })
      },
      include: {
        user: {
          select: { username: true }
        }
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Get container status
    let containerStatus = 'offline';
    let resources = { cpu: 0, memory: 0, network: { in: 0, out: 0 } };

    if (server.containerId) {
      try {
        containerStatus = await serverManager.getServerStatus(server.containerId);
        resources = await serverManager.getContainerStats(server.containerId);
      } catch (error) {
        logger.warn(`Failed to get container status for server ${id}:`, error);
      }
    }

    return res.json({
      ...server,
      status: containerStatus,
      resources
    });
  } catch (error) {
    logger.error('Error fetching server:', error);
    return res.status(500).json({ error: 'Failed to fetch server' });
  }
});

// Start server
router.post('/:id/start', async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const server = await prisma.server.findFirst({
      where: {
        id,
        ...(user.role === 'admin' ? {} : { userId: user.userId })
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    await serverManager.startServer(server.containerId || '');
    
    await prisma.server.update({
      where: { id },
      data: { status: 'starting' }
    });

    return res.json({ message: 'Server start initiated' });
  } catch (error) {
    logger.error('Error starting server:', error);
    return res.status(500).json({ error: 'Failed to start server' });
  }
});

// Stop server
router.post('/:id/stop', async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const server = await prisma.server.findFirst({
      where: {
        id,
        ...(user.role === 'admin' ? {} : { userId: user.userId })
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    await serverManager.stopServer(server.containerId || '');
    
    await prisma.server.update({
      where: { id },
      data: { status: 'stopping' }
    });

    return res.json({ message: 'Server stop initiated' });
  } catch (error) {
    logger.error('Error stopping server:', error);
    return res.status(500).json({ error: 'Failed to stop server' });
  }
});

// Restart server
router.post('/:id/restart', async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const server = await prisma.server.findFirst({
      where: {
        id,
        ...(user.role === 'admin' ? {} : { userId: user.userId })
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    await serverManager.restartServer(server.containerId || '');
    
    await prisma.server.update({
      where: { id },
      data: { status: 'restarting' }
    });

    return res.json({ message: 'Server restart initiated' });
  } catch (error) {
    logger.error('Error restarting server:', error);
    return res.status(500).json({ error: 'Failed to restart server' });
  }
});

// Delete server
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const server = await prisma.server.findFirst({
      where: {
        id,
        ...(user.role === 'admin' ? {} : { userId: user.userId })
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Stop and remove container
    if (server.containerId) {
      await serverManager.deleteServer(server.containerId);
    }

    // Delete server record
    await prisma.server.delete({ where: { id } });

    return res.json({ message: 'Server deleted successfully' });
  } catch (error) {
    logger.error('Error deleting server:', error);
    return res.status(500).json({ error: 'Failed to delete server' });
  }
});

export default router;