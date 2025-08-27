#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const log = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  error: (msg) => console.log(chalk.red('✗'), msg),
  warn: (msg) => console.log(chalk.yellow('⚠'), msg),
};

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log.success(`${description} exists`);
    return true;
  } else {
    log.error(`${description} is missing`);
    return false;
  }
}

function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    log.success(`${description} exists`);
    return true;
  } else {
    log.error(`${description} is missing`);
    return false;
  }
}

function checkNodeModules(projectPath, projectName) {
  const nodeModulesPath = path.join(projectPath, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    log.success(`${projectName} dependencies installed`);
    return true;
  } else {
    log.error(`${projectName} dependencies not installed`);
    return false;
  }
}

function checkDatabaseConnection() {
  try {
    const dbPath = path.join(__dirname, '..', 'backend', 'prisma', 'dev.db');
    if (fs.existsSync(dbPath)) {
      log.success('Database file exists');
      return true;
    } else {
      log.error('Database file not found');
      return false;
    }
  } catch (error) {
    log.error('Database check failed:', error.message);
    return false;
  }
}

function checkDockerNetwork() {
  try {
    const output = execSync('docker network ls --filter name=gamehost-network --format "{{.Name}}"', { 
      encoding: 'utf8', 
      stdio: 'pipe' 
    });
    if (output.trim() === 'gamehost-network') {
      log.success('Docker network gamehost-network exists');
      return true;
    } else {
      log.error('Docker network gamehost-network not found');
      return false;
    }
  } catch (error) {
    log.error('Docker network check failed:', error.message);
    return false;
  }
}

function checkPorts() {
  const ports = [3000, 5000];
  let allAvailable = true;

  ports.forEach(port => {
    try {
      execSync(`lsof -i :${port}`, { stdio: 'pipe' });
      log.warn(`Port ${port} is in use`);
    } catch (error) {
      log.success(`Port ${port} is available`);
    }
  });

  return allAvailable;
}

function main() {
  console.log(chalk.cyan.bold('\n🔍 GameHost Control Panel - Setup Verification\n'));

  let allChecks = true;

  // Check project structure
  log.info('Checking project structure...');
  allChecks &= checkDirectory(path.join(__dirname, '..', 'frontend'), 'Frontend directory');
  allChecks &= checkDirectory(path.join(__dirname, '..', 'backend'), 'Backend directory');
  allChecks &= checkFile(path.join(__dirname, '..', 'docker-compose.yml'), 'Docker Compose file');

  // Check environment files
  log.info('\nChecking environment files...');
  allChecks &= checkFile(path.join(__dirname, '..', 'backend', '.env'), 'Backend .env file');
  allChecks &= checkFile(path.join(__dirname, '..', 'frontend', '.env'), 'Frontend .env file');

  // Check dependencies
  log.info('\nChecking dependencies...');
  allChecks &= checkNodeModules(path.join(__dirname, '..'), 'Root');
  allChecks &= checkNodeModules(path.join(__dirname, '..', 'frontend'), 'Frontend');
  allChecks &= checkNodeModules(path.join(__dirname, '..', 'backend'), 'Backend');

  // Check required directories
  log.info('\nChecking required directories...');
  allChecks &= checkDirectory(path.join(__dirname, '..', 'backend', 'data'), 'Backend data directory');
  allChecks &= checkDirectory(path.join(__dirname, '..', 'backend', 'logs'), 'Backend logs directory');

  // Check database
  log.info('\nChecking database...');
  allChecks &= checkDatabaseConnection();

  // Check Docker setup
  log.info('\nChecking Docker setup...');
  allChecks &= checkDockerNetwork();

  // Check ports
  log.info('\nChecking port availability...');
  checkPorts();

  // Check build files
  log.info('\nChecking build files...');
  const frontendBuild = path.join(__dirname, '..', 'frontend', 'dist');
  const backendBuild = path.join(__dirname, '..', 'backend', 'dist');
  
  if (fs.existsSync(frontendBuild)) {
    log.success('Frontend build exists');
  } else {
    log.warn('Frontend not built (run: npm run build in frontend/)');
  }

  if (fs.existsSync(backendBuild)) {
    log.success('Backend build exists');
  } else {
    log.warn('Backend not built (run: npm run build in backend/)');
  }

  console.log('\n' + '='.repeat(50));
  
  if (allChecks) {
    console.log(chalk.green.bold('🎉 All checks passed! Your setup is ready.'));
    console.log('\nTo start the application:');
    console.log(chalk.yellow('  Development: npm run dev'));
    console.log(chalk.yellow('  Docker: docker-compose up -d'));
  } else {
    console.log(chalk.red.bold('❌ Some checks failed. Please review the errors above.'));
    console.log('\nTo fix issues, try running:');
    console.log(chalk.yellow('  npm run setup'));
  }

  return allChecks;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = { main };