import Docker from 'dockerode';
import { logger } from '../utils/logger';

export const docker = new Docker({
  socketPath: process.env.DOCKER_HOST || '/var/run/docker.sock'
});

export async function setupDocker() {
  try {
    // Test Docker connection
    const info = await docker.info();
    logger.info('Connected to Docker successfully');
    logger.info(`Docker version: ${info.ServerVersion}`);
    
    // Create GameHost network if it doesn't exist
    const networks = await docker.listNetworks();
    const gamehostNetwork = networks.find(net => net.Name === 'gamehost-network');
    
    if (!gamehostNetwork) {
      await docker.createNetwork({
        Name: 'gamehost-network',
        Driver: 'bridge',
        IPAM: {
          Config: [{ Subnet: '172.20.0.0/16' }]
        }
      });
      logger.info('Created GameHost network');
    }
    
    return docker;
  } catch (error) {
    logger.error('Docker connection failed:', error);
    throw error;
  }
}

export async function getDockerStats() {
  try {
    const containers = await docker.listContainers({ all: true });
    const info = await docker.info();
    
    return {
      containers: {
        total: containers.length,
        running: containers.filter(c => c.State === 'running').length,
        stopped: containers.filter(c => c.State === 'exited').length
      },
      system: {
        cpus: info.NCPU,
        memory: info.MemTotal,
        version: info.ServerVersion
      }
    };
  } catch (error) {
    logger.error('Failed to get Docker stats:', error);
    throw error;
  }
}