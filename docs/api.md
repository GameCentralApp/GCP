# API Documentation

## Authentication

All API endpoints (except `/auth/login` and `/auth/register`) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "username": "admin",
    "email": "admin@gamehost.com",
    "role": "admin"
  }
}
```

## Servers

### List Servers
```http
GET /api/servers
```

### Create Server
```http
POST /api/servers
Content-Type: application/json

{
  "name": "My Minecraft Server",
  "game": "minecraft",
  "template": "minecraft-vanilla",
  "port": 25565,
  "memory": 2048,
  "cpu": 50
}
```

### Server Actions
```http
POST /api/servers/{id}/start
POST /api/servers/{id}/stop
POST /api/servers/{id}/restart
```

### Get Server Details
```http
GET /api/servers/{id}
```

### Execute Console Command
```http
POST /api/servers/{id}/console
Content-Type: application/json

{
  "command": "say Hello World!"
}
```

## File Management

### List Files
```http
GET /api/files/{serverId}?path=/server/plugins
```

### Upload Files
```http
POST /api/files/{serverId}/upload
Content-Type: multipart/form-data

files: [File objects]
```

### Download File
```http
GET /api/files/{serverId}/download/server.properties
```

### Delete File
```http
DELETE /api/files/{serverId}/logs/latest.log
```

## Users (Admin Only)

### List Users
```http
GET /api/users
```

### Create User
```http
POST /api/users
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "role": "user"
}
```

### Update User
```http
PUT /api/users/{id}
Content-Type: application/json

{
  "role": "admin"
}
```

### Delete User
```http
DELETE /api/users/{id}
```

## Templates

### List Templates
```http
GET /api/templates
```

### Get Template
```http
GET /api/templates/{id}
```

### Create Template
```http
POST /api/templates
Content-Type: application/json

{
  "name": "Custom Minecraft",
  "description": "Custom Minecraft server with mods",
  "game": "Minecraft",
  "version": "1.20.4",
  "category": "modded",
  "image": "itzg/minecraft-server:latest",
  "config": {
    "environment": ["EULA=TRUE", "TYPE=FORGE"],
    "ports": ["25565"],
    "volumes": ["/server"],
    "requirements": {
      "cpu": 4,
      "memory": 4096,
      "disk": 2048
    }
  }
}
```

## WebSocket Events

Connect to WebSocket at `/socket.io/` with JWT token in auth header.

### Server Monitoring
```javascript
// Subscribe to server updates
socket.emit('subscribe-server', 'server-id');

// Receive real-time stats
socket.on('server-stats', (data) => {
  console.log('CPU:', data.cpu, 'Memory:', data.memory);
});

// Console output
socket.on('console-output', (data) => {
  console.log('Server output:', data.output);
});
```

### Console Commands
```javascript
// Send console command
socket.emit('console-command', {
  serverId: 'server-id',
  command: 'say Hello World!'
});
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- Authentication: 5 requests per minute
- General API: 100 requests per minute
- File uploads: 10 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```