const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createServer } = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth').default || require('./routes/auth');
const serverRoutes = require('./routes/servers').default || require('./routes/servers');
const userRoutes = require('./routes/users').default || require('./routes/users');
const fileRoutes = require('./routes/files').default || require('./routes/files');
const templateRoutes = require('./routes/templates').default || require('./routes/templates');
const settingsRoutes = require('./routes/settings').default || require('./routes/settings');

const { authenticateToken } = require('./middleware/auth');
const { setupDatabase } = require('./config/database');
const { setupDocker } = require('./config/docker');
const { initSocketHandlers } = require('./services/socket');
const { logger } = require('./utils/logger');

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
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://31.97.117.108:3000"
  ],
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
app.get('/health', (req: any, res: any) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.io handlers
initSocketHandlers(io);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize services
async function startServer() {
  try {
    await setupDatabase();
    await setupDocker();
    
    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`GameHost Control Panel Backend running on port ${PORT}`);
      logger.info(`Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
      logger.info(`Server accessible at: http://31.97.117.108:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = { io };