import express from 'express';
import { prisma } from '../config/database';
import { requireAdmin } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

// Get all settings (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    
    // Convert to key-value object
    const settingsObj = settings.reduce((acc, setting) => {
      let value = setting.value;
      
      // Parse based on type
      if (setting.type === 'boolean') {
        (value as any) = setting.value === 'true';
      } else if (setting.type === 'number') {
        (value as any) = parseFloat(setting.value);
      } else if (setting.type === 'json') {
        (value as any) = JSON.parse(setting.value);
      }
      
      acc[setting.key] = value;
      return acc;
    }, {} as any);

    return res.json(settingsObj);
  } catch (error) {
    logger.error('Error fetching settings:', error);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings (admin only)
router.put('/', requireAdmin, async (req, res) => {
  try {
    const updates = req.body;
    
    // Update each setting
    for (const [key, value] of Object.entries(updates)) {
      const type = typeof value === 'boolean' ? 'boolean' :
                   typeof value === 'number' ? 'number' :
                   typeof value === 'object' ? 'json' : 'string';
      
      const stringValue = type === 'json' ? JSON.stringify(value) : String(value);
      
      await prisma.setting.upsert({
        where: { key },
        update: { value: stringValue, type },
        create: { key, value: stringValue, type }
      });
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    logger.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Reset settings to defaults (admin only)
router.post('/reset', requireAdmin, async (req, res) => {
  try {
    // Delete all custom settings
    await prisma.setting.deleteMany();
    
    res.json({ message: 'Settings reset to defaults' });
  } catch (error) {
    logger.error('Error resetting settings:', error);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
});

export default router;