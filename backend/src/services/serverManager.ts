import Docker from 'dockerode';
import { docker } from '../config/docker';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs/promises';

export class ServerManager {
  async createServer(serverData: any): Promise<string> {
    try {
      // Create server directory
      const serverDir = path.join(process.cwd(), 'data', 'servers', serverData.id);
      await fs.mkdir(serverDir, { recursive: true });

      // Get template configuration
      const template = await this.getTemplate(serverData.template);
      
      // Create container
      const container = await docker.createContainer({
        Image: template.image,
        name: `gamehost-${serverData.id}`,
        Env: template.environment || [],
        ExposedPorts: {
          [`${serverData.port}/tcp`]: {},
        },
        HostConfig: {
          Memory: serverData.memory * 1024 * 1024, // Convert MB to bytes
          CpuQuota: serverData.cpu * 1000,
          CpuPeriod: 100000,
          PortBindings: {
            [`${serverData.port}/tcp`]: [{ HostPort: serverData.port.toString() }],
          },
          Binds: [`${serverDir}:/server`],
          NetworkMode: 'gamehost-network',
          RestartPolicy: { Name: 'unless-stopped' }
        },
        WorkingDir: '/server',
        Cmd: template.startCommand
      });

      logger.info(`Created container for server ${serverData.name}: ${container.id}`);
      return container.id;
    } catch (error) {
      logger.error('Error creating server container:', error);
      throw error;
    }
  }

  async startServer(containerId: string): Promise<void> {
    try {
      const container = docker.getContainer(containerId);
      await container.start();
      logger.info(`Started container: ${containerId}`);
    } catch (error) {
      logger.error(`Error starting container ${containerId}:`, error);
      throw error;
    }
  }

  async stopServer(containerId: string): Promise<void> {
    try {
      const container = docker.getContainer(containerId);
      await container.stop();
      logger.info(`Stopped container: ${containerId}`);
    } catch (error) {
      logger.error(`Error stopping container ${containerId}:`, error);
      throw error;
    }
  }

  async restartServer(containerId: string): Promise<void> {
    try {
      const container = docker.getContainer(containerId);
      await container.restart();
      logger.info(`Restarted container: ${containerId}`);
    } catch (error) {
      logger.error(`Error restarting container ${containerId}:`, error);
      throw error;
    }
  }

  async deleteServer(containerId: string): Promise<void> {
    try {
      const container = docker.getContainer(containerId);
      
      // Stop container if running
      try {
        await container.stop();
      } catch (error) {
        // Container might already be stopped
      }
      
      // Remove container
      await container.remove({ force: true });
      logger.info(`Deleted container: ${containerId}`);
    } catch (error) {
      logger.error(`Error deleting container ${containerId}:`, error);
      throw error;
    }
  }

  async getServerStatus(containerId: string): Promise<string> {
    try {
      const container = docker.getContainer(containerId);
      const containerInfo = await container.inspect();
      
      if (containerInfo.State.Running) {
        return 'online';
      } else if (containerInfo.State.Restarting) {
        return 'restarting';
      } else {
        return 'offline';
      }
    } catch (error) {
      return 'offline';
    }
  }

  async getContainerStats(containerId: string): Promise<any> {
    try {
      const container = docker.getContainer(containerId);
      const stream = await container.stats({ stream: false });
      
      const stats = JSON.parse(stream.toString());
      
      // Calculate CPU percentage
      const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - (stats.precpu_stats?.cpu_usage?.total_usage || 0);
      const systemDelta = stats.cpu_stats.system_cpu_usage - (stats.precpu_stats?.system_cpu_usage || 0);
      const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;

      // Calculate memory percentage
      const memoryUsage = stats.memory_stats.usage - (stats.memory_stats.cache || 0);
      const memoryPercent = (memoryUsage / stats.memory_stats.limit) * 100;

      return {
        cpu: Math.round(cpuPercent || 0),
        memory: Math.round(memoryPercent || 0),
        network: {
          in: stats.networks?.eth0?.rx_bytes || 0,
          out: stats.networks?.eth0?.tx_bytes || 0
        }
      };
    } catch (error) {
      return { cpu: 0, memory: 0, network: { in: 0, out: 0 } };
    }
  }

  async getServerLogs(containerId: string, lines: number = 100): Promise<string[]> {
    try {
      const container = docker.getContainer(containerId);
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        tail: lines,
        timestamps: true
      });
      
      return logs.toString().split('\n').filter(line => line.trim());
    } catch (error) {
      logger.error(`Error getting logs for container ${containerId}:`, error);
      return [];
    }
  }

  async executeCommand(containerId: string, command: string): Promise<string> {
    try {
      const container = docker.getContainer(containerId);
      const exec = await container.exec({
        Cmd: command.split(' '),
        AttachStdout: true,
        AttachStderr: true,
      });

      const stream = await exec.start({ Detach: false });
      return stream.toString();
    } catch (error) {
      logger.error(`Error executing command in container ${containerId}:`, error);
      throw error;
    }
  }

  private async getTemplate(templateName: string): Promise<any> {
    const templates = {
      'minecraft-vanilla': {
        image: 'itzg/minecraft-server:latest',
        environment: ['EULA=TRUE', 'TYPE=VANILLA'],
        startCommand: null // Use image default
      },
      'minecraft-forge': {
        image: 'itzg/minecraft-server:latest',
        environment: ['EULA=TRUE', 'TYPE=FORGE'],
        startCommand: null
      },
      'csgo-competitive': {
        image: 'cm2network/csgo:latest',
        environment: ['SRCDS_TOKEN='],
        startCommand: ['./srcds_run', '-game', 'csgo', '-console', '-usercon', '+game_type', '1']
      },
      'rust-vanilla': {
        image: 'didstopia/rust-server:latest',
        environment: ['RUST_SERVER_NAME=GameHost Server'],
        startCommand: null
      }
    };

    return templates[templateName as keyof typeof templates] || templates['minecraft-vanilla'];
  }
}