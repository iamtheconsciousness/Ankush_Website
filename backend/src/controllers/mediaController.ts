import { Request, Response } from 'express';
import Database from '../db/database';
import R2Service from '../services/r2Service';
import { MediaItem, ApiResponse } from '../types';

export class MediaController {
  private db: Database;
  private r2Service: R2Service | null = null;

  constructor() {
    this.db = new Database();
  }

  private getR2Service(): R2Service {
    if (!this.r2Service) {
      this.r2Service = new R2Service();
    }
    return this.r2Service;
  }

  async getAllMedia(req: Request, res: Response): Promise<void> {
    try {
      const media = await this.db.getAllMedia();
      
      const response: ApiResponse<MediaItem[]> = {
        success: true,
        data: media,
        message: 'Media fetched successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Get all media error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch media'
      });
    }
  }

  async getMediaByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const media = await this.db.getMediaByCategory(category);
      
      const response: ApiResponse<MediaItem[]> = {
        success: true,
        data: media,
        message: 'Media fetched successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Get media by category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch media'
      });
    }
  }

  async getMediaById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const media = await this.db.getMediaById(id);
      
      const response: ApiResponse<MediaItem> = {
        success: true,
        data: media,
        message: 'Media fetched successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Get media by ID error:', error);
      if (error instanceof Error && error.message === 'Media not found') {
        res.status(404).json({
          success: false,
          message: 'Media not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch media'
        });
      }
    }
  }

  async uploadMedia(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      const { title, caption, category } = req.body;

      if (!file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }

      // Validate file
      const validation = this.getR2Service().validateFile(file);
      if (!validation.valid) {
        res.status(400).json({
          success: false,
          message: validation.error
        });
        return;
      }

      // Upload to R2
      const { url, key } = await this.getR2Service().uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype
      );

      // Determine media type
      const mediaType = this.getR2Service().getMediaType(file.mimetype);

      // Save to database
      const mediaData = {
        file_name: file.originalname,
        file_url: url,
        title: title || file.originalname.split('.')[0],
        caption: caption || '',
        category: category || 'General',
        media_type: mediaType,
        uploaded_at: new Date().toISOString(),
        file_size: file.size,
        mime_type: file.mimetype
      };

      const media = await this.db.createMedia(mediaData);

      const response: ApiResponse<MediaItem> = {
        success: true,
        data: media,
        message: 'Media uploaded successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Upload media error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload media'
      });
    }
  }

  async updateMedia(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Remove fields that shouldn't be updated
      delete updates.id;
      delete updates.file_url;
      delete updates.file_name;
      delete updates.file_size;
      delete updates.mime_type;
      delete updates.uploaded_at;
      delete updates.created_at;

      const media = await this.db.updateMedia(id, updates);

      const response: ApiResponse<MediaItem> = {
        success: true,
        data: media,
        message: 'Media updated successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Update media error:', error);
      if (error instanceof Error && error.message === 'Media not found') {
        res.status(404).json({
          success: false,
          message: 'Media not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update media'
        });
      }
    }
  }

  async deleteMedia(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Get media item first to extract the R2 key
      const media = await this.db.getMediaById(id);
      const r2Key = this.getR2Service().extractKeyFromUrl(media.file_url);

      // Delete from R2
      await this.getR2Service().deleteFile(r2Key);

      // Delete from database
      await this.db.deleteMedia(id);

      const response: ApiResponse = {
        success: true,
        message: 'Media deleted successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Delete media error:', error);
      if (error instanceof Error && error.message === 'Media not found') {
        res.status(404).json({
          success: false,
          message: 'Media not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete media'
        });
      }
    }
  }
}
