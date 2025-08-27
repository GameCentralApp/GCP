# GameHost Control Panel - Installation Guide

## 🚀 Quick Installation (Recommended)

The fastest and most reliable way to install GameHost Control Panel:

```bash
git clone https://github.com/GameCentralApp/GCP.git
cd gamehost-control-panel
npm run setup
```

This single command will:
- ✅ Check system requirements
- ✅ Install all dependencies (root, frontend, backend)
- ✅ Create environment files with secure defaults
- ✅ Setup database and run migrations
- ✅ Create necessary directories
- ✅ Generate admin user
- ✅ Build applications
- ✅ Configure Docker network
- ✅ Verify installation

## 📋 Prerequisites

Before installation, ensure you have:

### Required Software
- **Node.js** v18.0.0+ ([Download](https://nodejs.org/))
- **npm** v8.0.0+ (comes with Node.js)
- **Docker** v20.10+ ([Install Guide](https://docs.docker.com/get-docker/))
- **Docker Compose** v2.0+ ([Install Guide](https://docs.docker.com/compose/install/))

### System Requirements
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 2GB | 4GB+ |
| CPU | 2 cores | 4+ cores |
| Disk | 10GB | 50GB+ |
| OS | Linux/macOS/Windows | Ubuntu 20.04+ |

### Verification Commands
```bash
# Check versions
node --version    # Should be v18.0.0+
npm --version     # Should be v8.0.0+
docker --version  # Should be v20.10+
docker-compose --version  # Should be v2.0+
```

## 🛠️ Installation Methods

### Method 1: Automated Setup (Recommended)

```bash
# Clone repository
git clone https://github.com/gamehost/control-panel.git
cd gamehost-control-panel

# Run automated setup
npm run setup

# Start development servers
npm run dev
```

### Method 2: Manual Setup

<details>
<summary>Click to expand manual installation steps</summary>

```bash
# 1. Clone repository
git clone https://github.com/gamehost/control-panel.git
cd gamehost-control-panel

# 2. Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..

# 3. Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Edit environment files (optional)
nano backend/.env
nano frontend/.env

# 5. Setup database
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run setup:admin
cd ..

# 6. Create required directories
mkdir -p backend/data/servers
mkdir -p backend/data/uploads
mkdir -p backend/logs

# 7. Setup Docker network
docker network create gamehost-network

# 8. Build applications
cd frontend && npm run build && cd ..
cd backend && npm run build && cd ..

# 9. Verify installation
npm run verify
```
</details>

### Method 3: Docker Installation

<details>
<summary>Click to expand Docker installation steps</summary>

```bash
# 1. Clone repository
git clone https://github.com/gamehost/control-panel.git
cd gamehost-control-panel

# 2. Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Build and start containers
docker-compose up -d

# 4. Create admin user (inside container)
docker-compose exec backend npm run setup:admin

# 5. Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```
</details>

## 🔧 Configuration

### Environment Configuration

The setup script creates secure default configurations, but you may want to customize:

#### Backend Configuration (`backend/.env`)
```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# Security (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key

# Docker
DOCKER_HOST=/var/run/docker.sock

# File Upload
MAX_FILE_SIZE=104857600  # 100MB
UPLOAD_PATH=./data/uploads

# Logging
LOG_LEVEL=info

# Email (Optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

#### Frontend Configuration (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

### Database Configuration

#### SQLite (Default - Development)
```env
DATABASE_URL="file:./dev.db"
```

#### PostgreSQL (Production)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/gamehost"
```

#### MySQL (Alternative)
```env
DATABASE_URL="mysql://username:password@localhost:3306/gamehost"
```

## 🚀 Starting the Application

### Development Mode
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Port 3000
npm run dev:backend   # Port 5000
```

### Production Mode
```bash
# Build applications
npm run build

# Start production server
npm run start
```

### Docker Mode
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔐 First Login

After installation, access the application:

1. **Open browser**: http://localhost:3000
2. **Login with default credentials**:
   - Username: `admin`
   - Password: `admin123`
3. **⚠️ IMPORTANT**: Change the default password immediately!

## ✅ Verification

### Automated Verification
```bash
npm run verify
```

This checks:
- Dependencies installed
- Environment files configured
- Database connection
- Docker network created
- Required directories exist
- Ports available
- Build files present

### Manual Verification
```bash
# Check services are running
curl http://localhost:5000/health  # Backend health check
curl http://localhost:3000         # Frontend

# Check database
cd backend
npx prisma studio  # Opens database browser

# Check Docker
docker network ls | grep gamehost
docker ps  # Should show running containers
```

## 🚨 Troubleshooting

### Common Installation Issues

#### Permission Denied (Docker)
```bash
# Linux: Add user to docker group
sudo usermod -aG docker $USER
sudo systemctl restart docker
# Log out and back in

# macOS/Windows: Restart Docker Desktop
```

#### Port Already in Use
```bash
# Find what's using the port
lsof -i :3000  # Frontend
lsof -i :5000  # Backend

# Kill the process or change ports in .env
```

#### Node Version Issues
```bash
# Install Node Version Manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node 18+
nvm install 18
nvm use 18
```

#### Database Connection Failed
```bash
# Reset database
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
npm run setup:admin
```

#### Dependencies Installation Failed
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
npm run clean
npm run setup
```

### Platform-Specific Issues

#### Linux (Ubuntu/Debian)
```bash
# Install required packages
sudo apt update
sudo apt install -y curl git build-essential

# Fix Docker permissions
sudo chmod 666 /var/run/docker.sock
```

#### macOS
```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install Docker Desktop from website
```

#### Windows
```bash
# Use PowerShell as Administrator
# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Node.js
choco install nodejs

# Install Docker Desktop from website
# Enable WSL2 integration
```

## 🔄 Updates & Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm run install:all

# Run database migrations
cd backend && npx prisma migrate dev

# Rebuild applications
npm run build
```

### Backup & Restore
```bash
# Backup database
cp backend/prisma/dev.db backup/gamehost-$(date +%Y%m%d).db

# Backup server data
tar -czf backup/servers-$(date +%Y%m%d).tar.gz backend/data/servers/

# Restore database
cp backup/gamehost-20240101.db backend/prisma/dev.db
```

## 📞 Getting Help

If you encounter issues:

1. **Check logs**: `backend/logs/combined.log`
2. **Run verification**: `npm run verify`
3. **Search issues**: [GitHub Issues](https://github.com/gamehost/control-panel/issues)
4. **Ask for help**: [GitHub Discussions](https://github.com/gamehost/control-panel/discussions)
5. **Join Discord**: [Community Server](https://discord.gg/gamehost)

## 🎯 Next Steps

After successful installation:

1. **Change default password**
2. **Create your first game server**
3. **Explore templates**
4. **Configure backups**
5. **Set up SSL (production)**
6. **Configure firewall**
7. **Monitor resources**

---

**Installation complete!** 🎉 You're ready to start hosting game servers.