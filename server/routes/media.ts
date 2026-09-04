import { Router, Request, Response } from 'express';
import multer from 'multer';
import { mediaStorage } from '../services/mediaStorage';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Multer memory storage with 100MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max limit
  },
  fileFilter: (req, file, cb) => {
    const mime = file.mimetype.toLowerCase();
    if (
      mime.startsWith('image/') ||
      mime.startsWith('audio/') ||
      mime.startsWith('video/') ||
      mime === 'application/ogg'
    ) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file format (${file.mimetype}). Please upload an image, audio, or video file.`));
    }
  },
});

/**
 * POST /api/media/upload
 * Requires Admin Auth.
 * Saves to persistent MongoDB GridFS (or local disk fallback).
 */
router.post(
  '/upload',
  requireAuth,
  upload.single('file'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const file = req.file;
      const mime = file.mimetype.toLowerCase();

      // Additional type-specific size checks
      if (mime.startsWith('image/') && file.size > 20 * 1024 * 1024) {
        return res.status(400).json({ error: 'Image file size exceeds 20MB limit.' });
      }
      if (mime.startsWith('audio/') && file.size > 40 * 1024 * 1024) {
        return res.status(400).json({ error: 'Audio file size exceeds 40MB limit.' });
      }
      if (mime.startsWith('video/') && file.size > 105 * 1024 * 1024) {
        return res.status(400).json({ error: 'Video file size exceeds 100MB limit.' });
      }

      const stored = await mediaStorage.storeMedia(
        file.buffer,
        file.originalname || `upload_${Date.now()}`,
        file.mimetype
      );

      return res.json({
        success: true,
        data: {
          url: stored.url,
          id: stored.id,
          filename: stored.filename,
          contentType: stored.contentType,
          size: stored.size,
          storage: stored.storage,
        },
      });
    } catch (err: any) {
      console.error('Media upload error:', err);
      return res.status(500).json({ error: err.message || 'Failed to upload media file' });
    }
  }
);

/**
 * HEAD /api/media/:id
 * Fast metadata inspection
 */
router.head('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const meta = await mediaStorage.getMediaMeta(id);
    if (!meta) {
      return res.status(404).end();
    }

    res.set({
      'Content-Type': meta.contentType,
      'Content-Length': meta.size.toString(),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    });
    return res.status(200).end();
  } catch (err) {
    return res.status(500).end();
  }
});

/**
 * GET /api/media/:id
 * Publicly accessible.
 * Supports HTTP Range Requests for video seeking, audio streaming, and images.
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const meta = await mediaStorage.getMediaMeta(id);

    if (!meta) {
      return res.status(404).json({ error: 'Media file not found' });
    }

    const fileSize = meta.size;
    const range = req.headers.range;

    // Handle Range Requests (essential for HTML5 Video and Audio seeking/streaming)
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (isNaN(start) || isNaN(end) || start > end || start >= fileSize) {
        res.set('Content-Range', `bytes */${fileSize}`);
        return res.status(416).send('Requested range not satisfiable');
      }

      const chunkSize = end - start + 1;
      const downloadStream = mediaStorage.getDownloadStream(meta, {
        start,
        end: end + 1, // GridFS openDownloadStream end is exclusive in some drivers, +1 ensures full chunk
      });

      if (!downloadStream) {
        return res.status(500).json({ error: 'Failed to open media stream' });
      }

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': meta.contentType,
        'Cache-Control': 'public, max-age=86400',
      });

      downloadStream.pipe(res);
    } else {
      // Full file response
      const downloadStream = mediaStorage.getDownloadStream(meta);
      if (!downloadStream) {
        return res.status(500).json({ error: 'Failed to open media stream' });
      }

      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': meta.contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
      });

      downloadStream.pipe(res);
    }
  } catch (err: any) {
    console.error('Media retrieval error:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Failed to serve media' });
    }
  }
});

/**
 * DELETE /api/media/:id
 * Requires Admin Auth.
 */
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await mediaStorage.deleteMedia(id);
    return res.json({ success: true, deleted });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete media' });
  }
});

export default router;
