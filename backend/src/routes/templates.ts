import express from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

const router = express.Router();

// Default templates
const defaultTemplates = [
  {
    id: 'minecraft-vanilla',
    name: 'Minecraft Vanilla',
    description: 'Official Minecraft server with no modifications',
    game: 'Minecraft',
    version: '1.20.4',
    category: 'vanilla',
    image: 'itzg/minecraft-server:latest',
    config: JSON.stringify({
      environment: ['EULA=TRUE', 'TYPE=VANILLA'],
      ports: ['25565'],
      volumes: ['/server'],
      requirements: { cpu: 2, memory: 2048, disk: 1024 }
    }),
    downloads: 2847,
    isPublic: true
  },
  {
    id: 'minecraft-forge',
    name: 'Minecraft Modded (Forge)',
    description: 'Minecraft server with Forge mod loader pre-installed',
    game: 'Minecraft',
    version: '1.20.1',
    category: 'modded',
    image: 'itzg/minecraft-server:latest',
    config: JSON.stringify({
      environment: ['EULA=TRUE', 'TYPE=FORGE'],
      ports: ['25565'],
      volumes: ['/server'],
      requirements: { cpu: 4, memory: 4096, disk: 2048 }
    }),
    downloads: 1923,
    isPublic: true
  },
  {
    id: 'csgo-competitive',
    name: 'CS:GO Competitive',
    description: 'Counter-Strike: Global Offensive competitive server setup',
    game: 'CS:GO',
    version: 'Latest',
    category: 'fps',
    image: 'cm2network/csgo:latest',
    config: JSON.stringify({
      environment: ['SRCDS_TOKEN='],
      ports: ['27015'],
      volumes: ['/home/steam/csgo-dedicated'],
      requirements: { cpu: 2, memory: 1024, disk: 512 }
    }),
    downloads: 3421,
    isPublic: true
  },
  {
    id: 'rust-vanilla',
    name: 'Rust Vanilla',
    description: 'Official Rust server with standard gameplay',
    game: 'Rust',
    version: 'Latest',
    category: 'survival',
    image: 'didstopia/rust-server:latest',
    config: JSON.stringify({
      environment: ['RUST_SERVER_NAME=GameHost Server'],
      ports: ['28015'],
      volumes: ['/steamcmd/rust'],
      requirements: { cpu: 4, memory: 8192, disk: 5120 }
    }),
    downloads: 1567,
    isPublic: true
  },
  {
    id: 'gmod-darkrp',
    name: 'Garry\'s Mod DarkRP',
    description: 'Popular roleplay gamemode for Garry\'s Mod',
    game: "Garry's Mod",
    version: 'Latest',
    category: 'roleplay',
    image: 'cm2network/gmod:latest',
    config: JSON.stringify({
      environment: ['SRCDS_TOKEN=', 'GAMEMODE=darkrp'],
      ports: ['27015'],
      volumes: ['/home/steam/gmod-dedicated'],
      requirements: { cpu: 2, memory: 2048, disk: 1024 }
    }),
    downloads: 2134,
    isPublic: true
  },
  {
    id: 'valheim-dedicated',
    name: 'Valheim Dedicated',
    description: 'Dedicated Valheim server for Viking adventures',
    game: 'Valheim',
    version: 'Latest',
    category: 'survival',
    image: 'lloesche/valheim-server:latest',
    config: JSON.stringify({
      environment: ['SERVER_NAME=GameHost Valheim', 'WORLD_NAME=GameHost'],
      ports: ['2456', '2457'],
      volumes: ['/config', '/opt/valheim'],
      requirements: { cpu: 2, memory: 2048, disk: 1024 }
    }),
    downloads: 892,
    isPublic: true
  }
];

// Get all templates
router.get('/', async (req, res) => {
  try {
    let templates = await prisma.template.findMany({
      where: { isPublic: true }
    });

    // If no templates in database, return defaults
    if (templates.length === 0) {
      const templatesWithImages = defaultTemplates.map((template, index) => {
        const images = [
          'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1314544/pexels-photo-1314544.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=400'
        ];
        
        return {
          ...template,
          image: images[index % images.length],
          requirements: JSON.parse(template.config).requirements,
          features: [
            template.category === 'vanilla' ? 'Easy setup' : 'Advanced features',
            'Auto-updates',
            'Backup support'
          ],
          rating: 4.5 + Math.random() * 0.4
        };
      });
      
      return res.json(templatesWithImages);
    }

    res.json(templates);
  } catch (error) {
    logger.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get template by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let template = await prisma.template.findUnique({
      where: { id }
    });

    // If not found in database, check defaults
    if (!template) {
      const defaultTemplate = defaultTemplates.find(t => t.id === id);
      if (defaultTemplate) {
        template = defaultTemplate as any;
      }
    }

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    logger.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Create custom template
router.post('/', async (req, res) => {
  try {
    const { name, description, game, version, category, image, config } = req.body;
    const user = (req as any).user;

    const template = await prisma.template.create({
      data: {
        name,
        description,
        game,
        version,
        category,
        image,
        config: JSON.stringify(config),
        isPublic: user.role === 'admin'
      }
    });

    res.status(201).json(template);
  } catch (error) {
    logger.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

export default router;