import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import archiver from 'archiver';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const serverId = req.params.serverId;
    const uploadPath = path.join(process.cwd(), 'data', 'servers', serverId);
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// List files
router.get('/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    const { path: requestedPath = '/' } = req.query;
    const user = (req as any).user;

    // Verify user has access to server
    const server = await prisma.server.findFirst({
      where: {
        id: serverId,
        ...(user.role === 'admin' ? {} : { userId: user.userId })
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const serverDir = path.join(process.cwd(), 'data', 'servers', serverId);
    const fullPath = path.join(serverDir, requestedPath as string);

    // Security check - ensure path is within server directory
    if (!fullPath.startsWith(serverDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    try {
      const items = await fs.readdir(fullPath, { withFileTypes: true });
      
      const files = await Promise.all(items.map(async (item) => {
        const itemPath = path.join(fullPath, item.name);
        const stats = await fs.stat(itemPath);
        
        return {
          name: item.name,
          type: item.isDirectory() ? 'directory' : 'file',
          size: item.isFile() ? stats.size : undefined,
          lastModified: stats.mtime,
          permissions: (stats.mode & parseInt('777', 8)).toString(8)
        };
      }));

      res.json({ files, currentPath: requestedPath });
    } catch (error) {
      return res.status(404).json({ error: 'Directory not found' });
    }
  } catch (error) {
    logger.error('Error listing files:', error);
    return res.status(500).json({ error: 'Failed to list files' });
  }
});

// Upload files
router.post('/:serverId/upload', upload.array('files'), async (req, res) => {
  try {
    const { serverId } = req.params;
    const user = (req as any).user;

    // Verify access
    const server = await prisma.server.findFirst({
      where: {
        id: serverId,
        ...(user.role === 'admin' ? {} : { userId: user.userId })
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const files = req.files as Express.Multer.File[];
    const uploadedFiles = files.map(file => ({
      name: file.originalname,
      size: file.size,
      path: file.path
    }));

    return res.json({ 
      message: 'Files uploaded successfully',
      files: uploadedFiles 
    });
  } catch (error) {
    logger.error('Error uploading files:', error);
    return res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Download file
router.get('/:serverId/download/*', async (req, res) => {
  try {
    const { serverId } = req.params;
    const filePath = (req.params as any)[0];
    const user = (req as any).user;

    // Verify access
    const server = await prisma.server.findFirst({
      where: {
        id: serverId,
        ...(user.role === 'admin' ? {} : { userId: user.userId })
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const serverDir = path.join(process.cwd(), 'data', 'servers', serverId);
    const fullPath = path.join(serverDir, filePath);

    // Security check
    if (!fullPath.startsWith(serverDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const stats = await fs.stat(fullPath);
    
    if (stats.isDirectory()) {
      // Create zip archive for directories
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      res.attachment(`${path.basename(filePath)}.zip`);
      archive.pipe(res);
      archive.directory(fullPath, false);
      await archive.finalize();
    } else {
      // Send file directly
      return res.download(fullPath);
    }
  } catch (error) {
    logger.error('Error downloading file:', error);
    return res.status(500).json({ error: 'Failed to download file' });
  }
});

// Delete file/directory
router.delete('/:serverId/*', async (req, res) => {
  try {
    const { serverId } = req.params;
    const filePath = (req.params as any)[0];
    const user = (req as any).user;

    // Verify access
    const server = await prisma.server.findFirst({
      where: {
        id: serverId,
        ...(user.role === 'admin' ? {} : { userId: user.userId })
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const serverDir = path.join(process.cwd(), 'data', 'servers', serverId);
    const fullPath = path.join(serverDir, filePath);

    // Security check
    if (!fullPath.startsWith(serverDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const stats = await fs.stat(fullPath);
    
    if (stats.isDirectory()) {
      await fs.rmdir(fullPath, { recursive: true });
    } else {
      await fs.unlink(fullPath);
    }

    return res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    logger.error('Error deleting file:', error);
    return res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;