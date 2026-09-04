import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import mongoose from 'mongoose';

export interface StoredMediaInfo {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  url: string;
  storage: 'gridfs' | 'local';
}

class MediaStorageService {
  private localDir: string;
  private localMetaFile: string;

  constructor() {
    this.localDir = path.join(process.cwd(), '.data', 'media_uploads');
    this.localMetaFile = path.join(this.localDir, 'meta.json');
    this.ensureLocalDir();
  }

  private ensureLocalDir() {
    if (!fs.existsSync(this.localDir)) {
      try {
        fs.mkdirSync(this.localDir, { recursive: true });
      } catch (e) {
        // ignore
      }
    }
  }

  private getGridFSBucket(): mongoose.mongo.GridFSBucket | null {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'media_files',
      });
    }
    return null;
  }

  private readLocalMeta(): Record<string, any> {
    try {
      if (fs.existsSync(this.localMetaFile)) {
        return JSON.parse(fs.readFileSync(this.localMetaFile, 'utf-8'));
      }
    } catch {
      // ignore
    }
    return {};
  }

  private writeLocalMeta(meta: Record<string, any>) {
    try {
      this.ensureLocalDir();
      fs.writeFileSync(this.localMetaFile, JSON.stringify(meta, null, 2));
    } catch (e) {
      console.warn('Failed to write local media metadata:', e);
    }
  }

  /**
   * Store media buffer into GridFS (preferred) or local fallback.
   */
  public async storeMedia(
    buffer: Buffer,
    originalName: string,
    contentType: string
  ): Promise<StoredMediaInfo> {
    const bucket = this.getGridFSBucket();

    // Prefer GridFS if Mongo is connected (survives Render restarts & redeploys!)
    if (bucket) {
      return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(originalName, {
          metadata: {
            contentType,
            originalName,
            uploadedAt: new Date().toISOString(),
          },
        });

        const readStream = new Readable();
        readStream.push(buffer);
        readStream.push(null);

        uploadStream.on('error', (err) => {
          console.error('GridFS upload error:', err);
          reject(err);
        });

        uploadStream.on('finish', () => {
          const fileId = uploadStream.id.toString();
          resolve({
            id: fileId,
            filename: originalName,
            contentType,
            size: buffer.length,
            url: `/api/media/${fileId}`,
            storage: 'gridfs',
          });
        });

        readStream.pipe(uploadStream);
      });
    }

    // Local Disk Fallback
    this.ensureLocalDir();
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storedFileName = `${id}_${sanitizedName}`;
    const filePath = path.join(this.localDir, storedFileName);

    fs.writeFileSync(filePath, buffer);

    const meta = this.readLocalMeta();
    meta[id] = {
      id,
      filename: originalName,
      storedFileName,
      contentType,
      size: buffer.length,
      uploadedAt: new Date().toISOString(),
    };
    this.writeLocalMeta(meta);

    return {
      id,
      filename: originalName,
      contentType,
      size: buffer.length,
      url: `/api/media/${id}`,
      storage: 'local',
    };
  }

  /**
   * Get metadata for a file
   */
  public async getMediaMeta(id: string): Promise<{
    id: string;
    filename: string;
    contentType: string;
    size: number;
    storage: 'gridfs' | 'local';
    objectId?: mongoose.Types.ObjectId;
    filePath?: string;
  } | null> {
    const bucket = this.getGridFSBucket();

    // 1. Check GridFS if valid ObjectId
    if (bucket && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const objectId = new mongoose.Types.ObjectId(id);
        const files = await bucket.find({ _id: objectId }).toArray();
        if (files.length > 0) {
          const file = files[0];
          return {
            id,
            filename: file.filename,
            contentType: (file.metadata as any)?.contentType || 'application/octet-stream',
            size: file.length,
            storage: 'gridfs',
            objectId,
          };
        }
      } catch (err) {
        console.warn('Error querying GridFS for file:', err);
      }
    }

    // 2. Check Local Disk Fallback
    const meta = this.readLocalMeta();
    const localInfo = meta[id];
    if (localInfo) {
      const filePath = path.join(this.localDir, localInfo.storedFileName);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        return {
          id,
          filename: localInfo.filename,
          contentType: localInfo.contentType || 'application/octet-stream',
          size: stats.size,
          storage: 'local',
          filePath,
        };
      }
    }

    return null;
  }

  /**
   * Get readable download stream, supporting byte ranges
   */
  public getDownloadStream(
    meta: {
      storage: 'gridfs' | 'local';
      objectId?: mongoose.Types.ObjectId;
      filePath?: string;
    },
    options?: { start?: number; end?: number }
  ): NodeJS.ReadableStream | null {
    if (meta.storage === 'gridfs' && meta.objectId) {
      const bucket = this.getGridFSBucket();
      if (!bucket) return null;
      return bucket.openDownloadStream(meta.objectId, options);
    }

    if (meta.storage === 'local' && meta.filePath && fs.existsSync(meta.filePath)) {
      return fs.createReadStream(meta.filePath, options);
    }

    return null;
  }

  /**
   * Delete media file
   */
  public async deleteMedia(id: string): Promise<boolean> {
    const bucket = this.getGridFSBucket();

    if (bucket && mongoose.Types.ObjectId.isValid(id)) {
      try {
        await bucket.delete(new mongoose.Types.ObjectId(id));
        return true;
      } catch {
        // file may not exist in GridFS
      }
    }

    const meta = this.readLocalMeta();
    const localInfo = meta[id];
    if (localInfo) {
      const filePath = path.join(this.localDir, localInfo.storedFileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // ignore
        }
      }
      delete meta[id];
      this.writeLocalMeta(meta);
      return true;
    }

    return false;
  }
}

export const mediaStorage = new MediaStorageService();
