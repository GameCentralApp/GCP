import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function setupDatabase() {
  try {
    await prisma.$connect();
    logger.info('Connected to database successfully');
    
    // Run any pending migrations
    // Note: In production, you should run migrations separately
    
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

export async function shutdownDatabase() {
  await prisma.$disconnect();
}

process.on('beforeExit', shutdownDatabase);
process.on('SIGINT', shutdownDatabase);
process.on('SIGTERM', shutdownDatabase);