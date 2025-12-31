import { Request, Response } from 'express';
import Database from '../db/database';
import { TextContent, ApiResponse, TextContentUpdate } from '../types';

export class TextContentController {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  async getTextContent(req: Request, res: Response): Promise<void> {
    try {
      const textContent = await this.db.getTextContent();
      
      const response: ApiResponse<TextContent[]> = {
        success: true,
        data: textContent,
        message: 'Text content fetched successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Get text content error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch text content'
      });
    }
  }

  async getTextContentByKey(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.params;
      const textContent = await this.db.getTextContentByKey(key);
      
      if (!textContent) {
        res.status(404).json({
          success: false,
          message: 'Text content not found'
        });
        return;
      }

      const response: ApiResponse<TextContent> = {
        success: true,
        data: textContent,
        message: 'Text content fetched successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Get text content by key error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch text content'
      });
    }
  }

  async updateTextContent(req: Request, res: Response): Promise<void> {
    try {
      const { key, value }: TextContentUpdate = req.body;

      if (!key || value === undefined) {
        res.status(400).json({
          success: false,
          message: 'Key and value are required'
        });
        return;
      }

      const textContent = await this.db.updateTextContent(key, value);

      const response: ApiResponse<TextContent> = {
        success: true,
        data: textContent,
        message: 'Text content updated successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Update text content error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update text content'
      });
    }
  }

  async updateMultipleTextContent(req: Request, res: Response): Promise<void> {
    try {
      const updates: TextContentUpdate[] = req.body;

      if (!Array.isArray(updates) || updates.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Updates array is required'
        });
        return;
      }

      // Validate all updates
      for (const update of updates) {
        if (!update.key || update.value === undefined) {
          res.status(400).json({
            success: false,
            message: 'Each update must have key and value'
          });
          return;
        }
      }

      const textContent = await this.db.updateMultipleTextContent(updates);

      const response: ApiResponse<TextContent[]> = {
        success: true,
        data: textContent,
        message: 'Text content updated successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Update multiple text content error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update text content'
      });
    }
  }
}
