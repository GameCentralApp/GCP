import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import serverRoutes from './routes/servers';
import userRoutes from './routes/users';
import fileRoutes from './routes/files';
import templateRoutes from './routes/templates';
import settingsRoutes from './routes/settings';

import { authenticateToken } from './middleware/auth';
import { setupDatabase } from './config/database';
import { setupDocker } from './config/docker';
import { initSocketHandlers } from './services/socket';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/servers', authenticateToken, serverRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/files', authenticateToken, fileRoutes);
app.use('/api/templates', authenticateToken, templateRoutes);
app.use('/api/settings', authenticateToken, settingsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.io handlers
initSocketHandlers(io);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize services
async function startServer() {
  try {
    await setupDatabase();
    await setupDocker();
    
    server.listen(PORT, () => {
      logger.info(`GameHost Control Panel Backend running on port ${PORT}`);
      logger.info(`Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { io };