# GameHost Control Panel

A comprehensive open-source server control panel specifically designed for game hosting with Docker integration.

## 🚀 Quick Start

Get your first game server running in under 15 minutes:

```bash
# Clone and setup
git clone https://github.com/gamehost/control-panel.git
cd gamehost-control-panel

# Install dependencies
npm run install:all

# Start development servers
npm run dev
```

## 📋 Requirements

- **Docker & Docker Compose** (v20.10+)
- **Node.js** (v18+)
- **Linux OS** (Ubuntu 20.04+, CentOS 8+, or Docker)

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

## 📖 Documentation

- [Installation Guide](docs/installation.md)
- [Configuration Reference](docs/configuration.md)
- [API Documentation](docs/api.md)
- [Game Templates](docs/templates.md)
- [Security Guide](docs/security.md)

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](docs/contributing.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.