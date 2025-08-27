import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export function initSocketHandlers(io: Server) {
  // Authentication middleware for socket connections
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;
    logger.info(`User ${user.username} connected via WebSocket`);

    // Join user-specific room
    socket.join(`user-${user.userId}`);
    
    // Join admin room if admin
    if (user.role === 'admin') {
      socket.join('admin');
    }

    // Server monitoring subscription
    socket.on('subscribe-server', (serverId: string) => {
      socket.join(`server-${serverId}`);
      logger.info(`User ${user.username} subscribed to server ${serverId}`);
    });

    socket.on('unsubscribe-server', (serverId: string) => {
      socket.leave(`server-${serverId}`);
      logger.info(`User ${user.username} unsubscribed from server ${serverId}`);
    });

    // Console command execution
    socket.on('console-command', async (data: { serverId: string; command: string }) => {
      try {
        // Verify user has access to server
        // Execute command logic here
        logger.info(`Console command from ${user.username}: ${data.command}`);
        
        // Emit response back to user
        socket.emit('console-output', {
          serverId: data.serverId,
          output: `[${new Date().toISOString()}] Command executed: ${data.command}`,
          timestamp: new Date()
        });
      } catch (error) {
        socket.emit('console-error', {
          serverId: data.serverId,
          error: 'Failed to execute command'
        });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`User ${user.username} disconnected`);
    });
  });

  // Periodic server stats broadcasting
  setInterval(async () => {
    try {
      // Get all running servers and broadcast stats
      // This would integrate with Docker to get real stats
      const mockStats = {
        timestamp: new Date(),
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        network: {
          in: Math.random() * 50,
          out: Math.random() * 30
        }
      };

      io.emit('server-stats', mockStats);
    } catch (error) {
      logger.error('Error broadcasting server stats:', error);
    }
  }, 5000); // Every 5 seconds
}