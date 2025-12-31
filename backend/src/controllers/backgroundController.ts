import { Request, Response } from 'express';
import multer from 'multer';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse, BackgroundImage } from '../types';

export class BackgroundController {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');
    this.db = new sqlite3.Database(dbPath);
  }

  // Simple multer configuration
  public getUploadMiddleware() {
    return multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed for background images'));
        }
      }
    }).single('backgroundImage');
  }

  // Get all background images
  public getAllBackgrounds = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = `
        SELECT id, section_type, section_name, background_image_url, file_name, 
               file_size, mime_type, created_at, updated_at
        FROM background_images 
        ORDER BY section_type ASC, section_name ASC
      `;

      this.db.all(query, [], (err, rows: any[]) => {
        if (err) {
          console.error('Error fetching all background images:', err);
          res.status(500).json({
            success: false,
            message: 'Failed to fetch background images'
          } as ApiResponse);
          return;
        }

        const backgrounds: BackgroundImage[] = rows.map(row => ({
          id: row.id,
          sectionType: row.section_type,
          sectionName: row.section_name,
          backgroundImageUrl: row.background_image_url,
          fileName: row.file_name,
          fileSize: row.file_size,
          mimeType: row.mime_type,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));

        res.json({
          success: true,
          data: backgrounds,
          message: 'All background images fetched successfully'
        } as ApiResponse);
      });
    } catch (error) {
      console.error('Error in getAllBackgrounds:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  };

  // Get background images by section type
  public getBackgroundsBySectionType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sectionType } = req.params;

      if (!['services', 'portfolio'].includes(sectionType)) {
        res.status(400).json({
          success: false,
          message: 'Invalid section type. Must be "services" or "portfolio"'
        } as ApiResponse);
        return;
      }

      const query = `
        SELECT id, section_type, section_name, background_image_url, file_name, 
               file_size, mime_type, created_at, updated_at
        FROM background_images 
        WHERE section_type = ?
        ORDER BY section_name ASC
      `;

      this.db.all(query, [sectionType], (err, rows: any[]) => {
        if (err) {
          console.error('Error fetching background images:', err);
          res.status(500).json({
            success: false,
            message: 'Failed to fetch background images'
          } as ApiResponse);
          return;
        }

        const backgrounds: BackgroundImage[] = rows.map(row => ({
          id: row.id,
          sectionType: row.section_type,
          sectionName: row.section_name,
          backgroundImageUrl: row.background_image_url,
          fileName: row.file_name,
          fileSize: row.file_size,
          mimeType: row.mime_type,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));

        res.json({
          success: true,
          data: backgrounds,
          message: 'Background images fetched successfully'
        } as ApiResponse);
      });
    } catch (error) {
      console.error('Error in getBackgroundsBySectionType:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  };

  // Upload background image
  public uploadBackgroundImage = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Upload request received');
      
      const { sectionType, sectionName } = req.body;
      const file = req.file;

      console.log('Request data:', { sectionType, sectionName, hasFile: !!file });

      if (!sectionType || !sectionName) {
        res.status(400).json({
          success: false,
          message: 'Section type and section name are required'
        } as ApiResponse);
        return;
      }

      if (!['services', 'portfolio'].includes(sectionType)) {
        res.status(400).json({
          success: false,
          message: 'Invalid section type. Must be "services" or "portfolio"'
        } as ApiResponse);
        return;
      }

      if (!file) {
        res.status(400).json({
          success: false,
          message: 'Background image file is required'
        } as ApiResponse);
        return;
      }

      console.log('File details:', { 
        originalname: file.originalname, 
        mimetype: file.mimetype, 
        size: file.size 
      });

      // Store file locally
      const uploadsDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileExtension = path.extname(file.originalname);
      const fileName = `background-${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, file.buffer);
      const url = `/uploads/${fileName}`;

      console.log('File stored locally:', { fileName, url });

      // Check if background image already exists for this section
      const checkQuery = 'SELECT id FROM background_images WHERE section_type = ? AND section_name = ?';
      
      this.db.get(checkQuery, [sectionType, sectionName], (err, existingRow: any) => {
        if (err) {
          console.error('Error checking existing background image:', err);
          res.status(500).json({
            success: false,
            message: 'Database error'
          } as ApiResponse);
          return;
        }

        if (existingRow) {
          // Update existing background image
          const updateQuery = `
            UPDATE background_images 
            SET background_image_url = ?, file_name = ?, file_size = ?, mime_type = ?, updated_at = CURRENT_TIMESTAMP
            WHERE section_type = ? AND section_name = ?
          `;

          this.db.run(updateQuery, [
            url,
            file.originalname,
            file.size,
            file.mimetype,
            sectionType,
            sectionName
          ], function(err) {
            if (err) {
              console.error('Error updating background image:', err);
              res.status(500).json({
                success: false,
                message: 'Failed to update background image'
              } as ApiResponse);
              return;
            }

            console.log('Background image updated successfully');
            res.json({
              success: true,
              data: {
                id: existingRow.id,
                sectionType,
                sectionName,
                backgroundImageUrl: url,
                fileName: file.originalname,
                fileSize: file.size,
                mimeType: file.mimetype
              },
              message: 'Background image updated successfully'
            } as ApiResponse);
          });
        } else {
          // Insert new background image
          const insertQuery = `
            INSERT INTO background_images (section_type, section_name, background_image_url, file_name, file_size, mime_type)
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          this.db.run(insertQuery, [
            sectionType,
            sectionName,
            url,
            file.originalname,
            file.size,
            file.mimetype
          ], function(err) {
            if (err) {
              console.error('Error inserting background image:', err);
              res.status(500).json({
                success: false,
                message: 'Failed to save background image'
              } as ApiResponse);
              return;
            }

            console.log('Background image inserted successfully');
            res.json({
              success: true,
              data: {
                id: this.lastID,
                sectionType,
                sectionName,
                backgroundImageUrl: url,
                fileName: file.originalname,
                fileSize: file.size,
                mimeType: file.mimetype
              },
              message: 'Background image uploaded successfully'
            } as ApiResponse);
          });
        }
      });
    } catch (error) {
      console.error('Error in uploadBackgroundImage:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  };

  // Delete background image
  public deleteBackgroundImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const deleteQuery = 'DELETE FROM background_images WHERE id = ?';
      
      this.db.run(deleteQuery, [id], function(err) {
        if (err) {
          console.error('Error deleting background image:', err);
          res.status(500).json({
            success: false,
            message: 'Failed to delete background image'
          } as ApiResponse);
          return;
        }

        res.json({
          success: true,
          message: 'Background image deleted successfully'
        } as ApiResponse);
      });
    } catch (error) {
      console.error('Error in deleteBackgroundImage:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  };
}