import { Router, Request, Response } from 'express';
import { dbService } from '../db/database';

const router = Router();

// GET /api/public/content or /api/public/all - single composite endpoint for fast, seamless site load
router.get(['/content', '/all'], async (req: Request, res: Response) => {
  try {
    const data = await dbService.getPublicData();
    res.setHeader('Cache-Control', 'no-cache');
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Error fetching public content:', err);
    return res.status(500).json({ error: 'Failed to retrieve content' });
  }
});

// GET /api/settings
router.get('/settings', async (req: Request, res: Response) => {
  try {
    const data = await dbService.getPublicData();
    return res.json(data.settings);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// GET /api/music
router.get('/music', async (req: Request, res: Response) => {
  try {
    const data = await dbService.getPublicData();
    return res.json(data.music);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch music' });
  }
});

// GET /api/messages
router.get('/messages', async (req: Request, res: Response) => {
  try {
    const data = await dbService.getPublicData();
    return res.json(data.messages);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// GET /api/shayari
router.get('/shayari', async (req: Request, res: Response) => {
  try {
    const data = await dbService.getPublicData();
    return res.json(data.shayari);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch shayari' });
  }
});

// GET /api/memories
router.get('/memories', async (req: Request, res: Response) => {
  try {
    const data = await dbService.getPublicData();
    return res.json(data.memories);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch memories' });
  }
});

// GET /api/videos
router.get('/videos', async (req: Request, res: Response) => {
  try {
    const data = await dbService.getPublicData();
    return res.json(data.videos);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// GET /api/love-cards
router.get('/love-cards', async (req: Request, res: Response) => {
  try {
    const data = await dbService.getPublicData();
    return res.json(data.loveCards);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch love cards' });
  }
});

// GET /api/timeline
router.get('/timeline', async (req: Request, res: Response) => {
  try {
    const data = await dbService.getPublicData();
    return res.json(data.timeline);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

// GET /api/countdown
router.get('/countdown', async (req: Request, res: Response) => {
  try {
    const data = await dbService.getPublicData();
    return res.json(data.countdown);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch countdown' });
  }
});

// GET /api/appearance
router.get('/appearance', async (req: Request, res: Response) => {
  try {
    const data = await dbService.getPublicData();
    return res.json(data.appearance);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch appearance settings' });
  }
});

export default router;
