# GameHost Control Panel

A comprehensive open-source server control panel specifically designed for game hosting with Docker integration.

## 🚀 Quick Start (Single Command)

Get your first game server running in under 5 minutes with our automated setup:

```bash
# Clone and setup
git clone https://github.com/GameCentralApp/GCP.git
cd GCP

# One-command setup (installs everything and configures the system)
npm run setup

# Start the application
npm run dev
```

**That's it!** The setup script handles everything automatically.

### Alternative Setup Methods

<details>
<summary>Manual Setup (click to expand)</summary>

```bash
# Install dependencies
npm run install:all

# Setup database
npm run db:setup

# Create environment files manually
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start development servers
npm run dev
```
</details>

<details>
<summary>Docker Setup (click to expand)</summary>

```bash
# Build and start with Docker
npm run docker:build
npm run docker:up

# Or use docker-compose directly
docker-compose up -d
```
</details>

## 📋 Requirements

### System Requirements
- **Node.js** v18.0.0 or higher
- **npm** v8.0.0 or higher  
- **Docker** v20.10+ (for container management)
- **Docker Compose** v2.0+ (for multi-container setup)

### Supported Operating Systems
- **Linux**: Ubuntu 20.04+, CentOS 8+, Debian 11+
- **macOS**: 10.15+ (with Docker Desktop)
- **Windows**: 10/11 (with Docker Desktop and WSL2)

### Hardware Recommendations
- **Minimum**: 2GB RAM, 2 CPU cores, 10GB disk space
- **Recommended**: 4GB RAM, 4 CPU cores, 50GB disk space
- **Production**: 8GB+ RAM, 8+ CPU cores, 100GB+ SSD

## ✨ Features

- 🐳 **Docker Integration** - Native Docker API support for container management
- 🎮 **Game Templates** - Pre-configured templates for Minecraft, CS:GO, Garry's Mod, and more
- 📊 **Real-time Monitoring** - Live CPU, RAM, and network usage tracking
- 🗂️ **File Manager** - Web-based file management with upload/download
- 💻 **Console Access** - Real-time console with command execution
- 🔒 **Role-based Access** - Admin, user, and viewer permission levels
- 💾 **Automated Backups** - Scheduled backups with one-click restoration
- 🔌 **Port Management** - Automatic port allocation and conflict detection

## 🏗️ Architecture

```
gamehost-control-panel/
├── frontend/          # React TypeScript frontend
├── backend/           # Node.js Express API
├── docker/           # Docker configurations
├── docs/             # Documentation
└── templates/        # Game server templates
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run setup` | **One-command setup** - installs everything |
| `npm run dev` | Start development servers (frontend + backend) |
| `npm run build` | Build frontend for production |
| `npm run start` | Start production server |
| `npm run verify` | Verify installation and configuration |
| `npm run clean` | Clean all node_modules and build files |
| `npm run docker:up` | Start with Docker Compose |
| `npm run docker:down` | Stop Docker containers |

## 🔧 Configuration

### Environment Variables

The setup script automatically creates `.env` files, but you can customize them:

**Backend (.env)**:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key
DOCKER_HOST=/var/run/docker.sock
```

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:5000
```

### Default Credentials
After setup, use these credentials to login:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password immediately after first login!

## 🚨 Troubleshooting

### Common Issues

**Setup fails with permission errors:**
```bash
# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
sudo systemctl restart docker
# Log out and back in
```

**Port already in use:**
```bash
# Check what's using the ports
lsof -i :3000  # Frontend
lsof -i :5000  # Backend

# Kill processes or change ports in .env files
```

**Database connection issues:**
```bash
# Reset database
cd backend
rm prisma/dev.db
npm run migrate
```

**Docker network issues:**
```bash
# Recreate Docker network
docker network rm gamehost-network
docker network create gamehost-network
```

**Dependencies out of sync:**
```bash
# Clean and reinstall everything
npm run clean
npm run setup
```

### Verification

Run the verification script to check your setup:
```bash
npm run verify
```

This will check:
- ✅ All dependencies installed
- ✅ Environment files configured  
- ✅ Database connection working
- ✅ Docker network created
- ✅ Required directories exist
- ✅ Ports available

### Getting Help

If you're still having issues:

1. **Check the logs**: Look in `backend/logs/` for error details
2. **Run verification**: `npm run verify` to identify issues
3. **Clean setup**: `npm run clean && npm run setup` for a fresh start
4. **Check Docker**: Ensure Docker is running and accessible
5. **File an issue**: Include your OS, Node version, and error logs

## 📖 Documentation

- [Installation Guide](docs/installation.md)
- [Configuration Reference](docs/configuration.md)
- [API Documentation](docs/api.md)
- [Game Templates](docs/templates.md)
- [Security Guide](docs/security.md)

## 🔄 Updates & Maintenance

### Updating Dependencies
```bash
# Update all dependencies to latest versions
npm update
cd frontend && npm update
cd ../backend && npm update
```

### Database Migrations
```bash
# Create new migration
cd backend
npx prisma migrate dev --name your-migration-name

# Reset database (development only)
npx prisma migrate reset
```

### Backup & Restore
```bash
# Backup (automated daily at 2 AM)
# Manual backup
docker exec gamehost-backend npm run backup

# Restore from backup
docker exec gamehost-backend npm run restore backup-file.tar.gz
```

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](docs/contributing.md) for details.

### Development Workflow
```bash
# Fork the repository and clone your fork
git clone https://github.com/YOUR-USERNAME/gamehost-control-panel.git
cd gamehost-control-panel

# Setup development environment
npm run setup

# Create feature branch
git checkout -b feature/your-feature-name

# Start development
npm run dev

# Run tests
npm test

# Submit pull request
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🌟 Support

- ⭐ **Star this repository** if you find it helpful
- 🐛 **Report bugs** via GitHub Issues  
- 💡 **Request features** via GitHub Discussions
- 📖 **Read the docs** for detailed guides
- 💬 **Join our community** for support and tips

---

**Made with ❤️ by the GameHost Control Panel Team**