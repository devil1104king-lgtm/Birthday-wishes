import { Router, Response } from 'express';
import { dbService } from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Protect all admin routes
router.use(requireAuth);

// GET /api/admin/all - full dashboard data
router.get('/all', async (req: AuthRequest, res: Response) => {
  try {
    const data = await dbService.getAllAdminData();
    return res.json({ success: true, data });
  } catch (err) {
    console.error('Error fetching admin data:', err);
    return res.status(500).json({ error: 'Failed to fetch admin data' });
  }
});

// PUT /api/admin/settings
router.put('/settings', async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dbService.updateSettings(req.body);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update settings' });
  }
});

// PUT /api/admin/hero
router.put('/hero', async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dbService.updateHero(req.body);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update hero section' });
  }
});

// PUT /api/admin/appearance
router.put('/appearance', async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dbService.updateAppearance(req.body);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update appearance' });
  }
});

// PUT /api/admin/countdown
router.put('/countdown', async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dbService.updateCountdown(req.body);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update countdown' });
  }
});

// PUT /api/admin/surprises
router.put('/surprises', async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dbService.updateSurprises(req.body);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update surprise settings' });
  }
});

// Generic Collection CRUD: music, messages, shayari, memories, videos, loveCards, timeline, reasons
const VALID_COLLECTIONS = ['music', 'messages', 'shayari', 'memories', 'videos', 'loveCards', 'timeline', 'reasons'];

router.get('/collection/:collection', async (req: AuthRequest, res: Response) => {
  try {
    const { collection } = req.params;
    if (!VALID_COLLECTIONS.includes(collection)) {
      return res.status(400).json({ error: 'Invalid collection' });
    }
    const items = await dbService.getCollectionItems(collection);
    return res.json({ success: true, data: items });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve items' });
  }
});

router.post('/collection/:collection', async (req: AuthRequest, res: Response) => {
  try {
    const { collection } = req.params;
    if (!VALID_COLLECTIONS.includes(collection)) {
      return res.status(400).json({ error: 'Invalid collection' });
    }
    const newItem = await dbService.createItem(collection, req.body);
    return res.json({ success: true, data: newItem });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create item' });
  }
});

router.put('/collection/:collection/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { collection, id } = req.params;
    if (!VALID_COLLECTIONS.includes(collection)) {
      return res.status(400).json({ error: 'Invalid collection' });
    }
    const updated = await dbService.updateItem(collection, id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Item not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update item' });
  }
});

router.delete('/collection/:collection/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { collection, id } = req.params;
    if (!VALID_COLLECTIONS.includes(collection)) {
      return res.status(400).json({ error: 'Invalid collection' });
    }
    await dbService.deleteItem(collection, id);
    return res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete item' });
  }
});

// POST /api/admin/reset - restore default seed content
router.post('/reset', async (req: AuthRequest, res: Response) => {
  try {
    const freshData = await dbService.resetDefaults();
    return res.json({ success: true, message: 'Default content successfully restored', data: freshData });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reset content' });
  }
});

export default router;
