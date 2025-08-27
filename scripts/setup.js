#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const rimraf = promisify(require('fs').rm || require('fs').rmdir);

// Simple logging without external dependencies
const log = {
  info: (msg) => console.log('ℹ', msg),
  success: (msg) => console.log('✓', msg),
  error: (msg) => console.log('✗', msg),
  warn: (msg) => console.log('⚠', msg),
};

function runCommand(command, description, cwd = process.cwd()) {
  console.log(`⏳ ${description}...`);
  try {
    execSync(command, { 
      cwd, 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    log.success(description);
    return true;
  } catch (error) {
    log.error(`${description} - ${error.message}`);
    return false;
  }
}

function checkPrerequisites() {
  log.info('Checking prerequisites...');
  
  const checks = [
    { cmd: 'node --version', name: 'Node.js', minVersion: '18.0.0' },
    { cmd: 'npm --version', name: 'npm', minVersion: '8.0.0' },
    { cmd: 'docker --version', name: 'Docker', required: true },
    { cmd: 'docker-compose --version', name: 'Docker Compose', required: true }
  ];

  let allPassed = true;

  checks.forEach(check => {
    try {
      const output = execSync(check.cmd, { encoding: 'utf8', stdio: 'pipe' });
      log.success(`${check.name} is installed: ${output.trim()}`);
    } catch (error) {
      if (check.required) {
        log.error(`${check.name} is required but not installed`);
        allPassed = false;
      } else {
        log.warn(`${check.name} is not installed (optional)`);
      }
    }
  });

  return allPassed;
}

async function cleanupOldData() {
  log.info('Cleaning up old data and services...');
  
  try {
    // Stop and remove existing Docker containers
    try {
      const containers = execSync('docker ps -a --filter "name=gamehost" --format "{{.Names}}"', { 
        encoding: 'utf8', 
        stdio: 'pipe' 
      }).trim().split('\n').filter(name => name);
      
      if (containers.length > 0) {
        log.info(`Stopping and removing ${containers.length} existing containers...`);
        containers.forEach(container => {
          try {
            execSync(`docker stop ${container}`, { stdio: 'pipe' });
            execSync(`docker rm ${container}`, { stdio: 'pipe' });
            log.success(`Removed container: ${container}`);
          } catch (error) {
            log.warn(`Failed to remove container ${container}: ${error.message}`);
          }
        });
      }
    } catch (error) {
      log.info('No existing GameHost containers found');
    }

    // Remove Docker network if it exists
    try {
      execSync('docker network rm gamehost-network', { stdio: 'pipe' });
      log.success('Removed existing Docker network');
    } catch (error) {
      log.info('No existing Docker network to remove');
    }

    // Clean up old data directories
    const dirsToClean = [
      'backend/data',
      'backend/logs',
      'backend/prisma/dev.db',
      'backend/dist',
      'frontend/dist',
      'node_modules',
      'frontend/node_modules',
      'backend/node_modules'
    ];

    for (const dir of dirsToClean) {
      const fullPath = path.join(__dirname, '..', dir);
      if (fs.existsSync(fullPath)) {
        try {
          if (fs.statSync(fullPath).isDirectory()) {
            await fs.promises.rm(fullPath, { recursive: true, force: true });
            log.success(`Removed directory: ${dir}`);
          } else {
            await fs.promises.unlink(fullPath);
            log.success(`Removed file: ${dir}`);
          }
        } catch (error) {
          log.warn(`Failed to remove ${dir}: ${error.message}`);
        }
      }
    }

    // Clean package-lock files for fresh dependency resolution
    const lockFiles = [
      'package-lock.json',
      'frontend/package-lock.json',
      'backend/package-lock.json'
    ];

    lockFiles.forEach(lockFile => {
      const fullPath = path.join(__dirname, '..', lockFile);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          log.success(`Removed lock file: ${lockFile}`);
        } catch (error) {
          log.warn(`Failed to remove ${lockFile}: ${error.message}`);
        }
      }
    });

    log.success('Cleanup completed successfully');
  } catch (error) {
    log.error('Cleanup failed:', error.message);
    // Don't exit on cleanup failure, continue with setup
  }
}

function createEnvFiles() {
  log.info('Setting up environment files...');
  
  const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
  const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env');
  
  // Backend .env
  if (!fs.existsSync(backendEnvPath)) {
    const backendEnvContent = `# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# Security
JWT_SECRET=gamehost-dev-secret-change-in-production-${Date.now()}

# Docker
DOCKER_HOST=/var/run/docker.sock

# Logging
LOG_LEVEL=info

# File Upload
MAX_FILE_SIZE=104857600
UPLOAD_PATH=./data/uploads

# Backup
BACKUP_RETENTION_DAYS=30
BACKUP_SCHEDULE=0 2 * * *
`;
    fs.writeFileSync(backendEnvPath, backendEnvContent);
    log.success('Created backend .env file');
  } else {
    log.info('Backend .env file already exists');
  }

  // Frontend .env
  if (!fs.existsSync(frontendEnvPath)) {
    const frontendEnvContent = `VITE_API_URL=http://localhost:5000
`;
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    log.success('Created frontend .env file');
  } else {
    log.info('Frontend .env file already exists');
  }
}

function setupDirectories() {
  log.info('Creating necessary directories...');
  
  const dirs = [
    'backend/data',
    'backend/data/servers',
    'backend/data/uploads',
    'backend/logs'
  ];

  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      log.success(`Created directory: ${dir}`);
    }
  });
}

async function main() {
  console.log('\n🎮 GameHost Control Panel Setup\n');
  
  // Clean up old data and services first
  await cleanupOldData();
  
  // Check prerequisites
  if (!checkPrerequisites()) {
    log.error('Prerequisites check failed. Please install missing requirements.');
    process.exit(1);
  }

  // Install root dependencies first (including ora and chalk)
  if (!runCommand('npm install', 'Installing root dependencies')) {
    process.exit(1);
  }

  // Install frontend dependencies
  if (!runCommand('npm install', 'Installing frontend dependencies', 'frontend')) {
    process.exit(1);
  }

  // Install backend dependencies
  if (!runCommand('npm install', 'Installing backend dependencies', 'backend')) {
    process.exit(1);
  }

  // Setup environment files
  createEnvFiles();

  // Setup directories
  setupDirectories();

  // Generate Prisma client and run migrations
  if (!runCommand('npx prisma generate', 'Generating Prisma client', 'backend')) {
    process.exit(1);
  }

  if (!runCommand('npx prisma migrate dev --name init', 'Running database migrations', 'backend')) {
    process.exit(1);
  }

  // Create admin user
  if (!runCommand('npm run setup:admin', 'Creating admin user', 'backend')) {
    log.warn('Failed to create admin user automatically. You can create one manually later.');
  }

  // Build projects
  if (!runCommand('npm run build', 'Building frontend', path.join(__dirname, '..', 'frontend'))) {
    log.warn('Frontend build failed. You can build it manually later.');
  }

  if (!runCommand('npm run build', 'Building backend', path.join(__dirname, '..', 'backend'))) {
    log.warn('Backend build failed. You can build it manually later.');
  }

  // Setup Docker network
  try {
    execSync('docker network create gamehost-network', { stdio: 'pipe' });
    log.success('Created Docker network: gamehost-network');
  } catch (error) {
    if (error.message.includes('already exists')) {
      log.info('Docker network gamehost-network already exists');
    } else {
      log.warn('Failed to create Docker network. You may need to create it manually.');
    }
  }

  console.log('\n🎉 Setup completed successfully!\n');
  
  console.log('Next steps:');
  console.log('1. Start the development servers:');
  console.log('   npm run dev');
  console.log('\n2. Or start with Docker:');
  console.log('   docker-compose up -d');
  console.log('\n3. Access the application:');
  console.log('   Frontend: http://localhost:3000');
  console.log('   Backend API: http://localhost:5000');
  console.log('\n4. Default admin credentials:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('   ⚠️  Please change the default password after first login!');
  console.log('\n📝 Note: This was a fresh installation - all previous data has been removed.');
}

if (require.main === module) {
  main().catch(error => {
    log.error('Setup failed:', error.message);
    process.exit(1);
  });
}

module.exports = { main, checkPrerequisites, createEnvFiles, setupDirectories, cleanupOldData };