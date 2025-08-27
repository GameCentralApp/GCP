import express from 'express';
import { docker } from '../config/docker';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { ServerManager } from '../services/serverManager';

const router = express.Router();
const serverManager = new ServerManager();

// Get all servers
router.get('/', async (req, res) => {
  try {
    const user = (req as any).user;
    
    const servers = await prisma.server.findMany({
      where: user.role === 'admin' ? {} : { userId: user.userId },
      include: {
        user: {
          select: { username: true }
        }
      }
    });

    // Get Docker container status for each server
    const serversWithStatus = await Promise.all(servers.map(async (server) => {
      try {
        const container = docker.getContainer(server.containerId || '');
        const containerInfo = await container.inspect();
        
        return {
          ...server,
          status: containerInfo.State.Running ? 'online' : 'offline',
          resources: await serverManager.getContainerStats(server.containerId || '')
        };
      } catch (error) {
        return {
          ...server,
          status: 'offline',
          resources: { cpu: 0, memory: 0, network: { in: 0, out: 0 } }
        };
      }
    }));

    return res.json(serversWithStatus);
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

    // Check user server limits
    const userServerCount = await prisma.server.count({
      where: { userId: user.userId }
    });

    if (user.role !== 'admin' && userServerCount >= 5) {
      return res.status(400).json({ error: 'Server limit reached' });
    }

    // Create server record
    const server = await prisma.server.create({
      data: {
        name,
        game,
        template,
        port,
        memory,
        cpu,
        userId: user.userId,
        status: 'offline'
      }
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