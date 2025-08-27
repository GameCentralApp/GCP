# Installation Guide

## Quick Start with Docker

The fastest way to get GameHost Control Panel running is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/gamehost/control-panel.git
cd gamehost-control-panel

# Create environment file
cp backend/.env.example backend/.env

# Edit the environment file with your settings
nano backend/.env

# Start all services
docker-compose up -d

# Create default admin user
docker-compose exec backend npm run setup:admin
```

Visit `http://localhost:3000` and login with the admin credentials.

## Manual Installation

### Requirements

- **Docker & Docker Compose** (v20.10+)
- **Node.js** (v18+)
- **PostgreSQL** (v13+) or **SQLite** for development

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure database:**
```bash
# For development (SQLite)
cp .env.example .env

# For production (PostgreSQL)
echo "DATABASE_URL=postgresql://user:password@localhost:5432/gamehost" >> .env
```

3. **Run database migrations:**
```bash
npx prisma migrate dev
npx prisma generate
```

4. **Create admin user:**
```bash
npm run setup:admin
```

5. **Start backend:**
```bash
npm run dev
```

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure environment:**
```bash
echo "VITE_API_URL=http://localhost:5000" > .env
```

3. **Start frontend:**
```bash
npm run dev
```

## Production Deployment

### Using Docker

1. **Build production images:**
```bash
docker-compose -f docker-compose.prod.yml build
```

2. **Deploy with reverse proxy:**
```bash
# Using Nginx
sudo apt install nginx
sudo cp nginx.conf /etc/nginx/sites-available/gamehost
sudo ln -s /etc/nginx/sites-available/gamehost /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Manual Production Setup

1. **Build frontend:**
```bash
cd frontend
npm run build
```

2. **Build backend:**
```bash
cd backend
npm run build
```

3. **Configure systemd service:**
```bash
sudo cp gamehost.service /etc/systemd/system/
sudo systemctl enable gamehost
sudo systemctl start gamehost
```

## Post-Installation

1. **Configure Docker access:**
```bash
sudo usermod -aG docker $USER
sudo systemctl restart docker
```

2. **Setup SSL (recommended):**
```bash
sudo certbot --nginx -d your-domain.com
```

3. **Configure firewall:**
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 25565:28015/tcp  # Game server ports
```

## Troubleshooting

### Common Issues

**Docker permission denied:**
```bash
sudo chmod 666 /var/run/docker.sock
```

**Database connection failed:**
- Check DATABASE_URL in .env file
- Ensure PostgreSQL is running
- Verify user permissions

**Port already in use:**
- Change ports in docker-compose.yml
- Check for existing services: `sudo netstat -tlnp`

**Frontend can't connect to backend:**
- Verify VITE_API_URL in frontend/.env
- Check CORS settings in backend
- Ensure backend is running on correct port