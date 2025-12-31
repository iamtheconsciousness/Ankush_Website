import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { MediaItem, TextContent, DatabaseMediaItem, DatabaseTextContent } from '../types';

class Database {
  private db: sqlite3.Database;
  private dbPath: string;

  constructor() {
    this.dbPath = process.env.DATABASE_PATH || './database.sqlite';
    this.db = new sqlite3.Database(this.dbPath);
    this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      // Read and execute schema
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = schema.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        await this.run(statement);
      }
      
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  private get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  private all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Media operations
  async createMedia(media: Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>): Promise<MediaItem> {
    const id = require('uuid').v4();
    const now = new Date().toISOString();
    
    const sql = `
      INSERT INTO media (id, file_name, file_url, title, caption, category, media_type, uploaded_at, file_size, mime_type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.run(sql, [
      id,
      media.file_name,
      media.file_url,
      media.title,
      media.caption,
      media.category,
      media.media_type,
      media.uploaded_at,
      media.file_size,
      media.mime_type,
      now,
      now
    ]);

    return this.getMediaById(id);
  }

  async getMediaById(id: string): Promise<MediaItem> {
    const sql = 'SELECT * FROM media WHERE id = ?';
    const row = await this.get(sql, [id]);
    
    if (!row) {
      throw new Error('Media not found');
    }

    return this.mapDatabaseMediaToMediaItem(row);
  }

  async getAllMedia(): Promise<MediaItem[]> {
    const sql = 'SELECT * FROM media ORDER BY uploaded_at DESC';
    const rows = await this.all(sql);
    return rows.map(row => this.mapDatabaseMediaToMediaItem(row));
  }

  async getMediaByCategory(category: string): Promise<MediaItem[]> {
    const sql = 'SELECT * FROM media WHERE category = ? ORDER BY uploaded_at DESC';
    const rows = await this.all(sql, [category]);
    return rows.map(row => this.mapDatabaseMediaToMediaItem(row));
  }

  async updateMedia(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    const now = new Date().toISOString();
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      return this.getMediaById(id);
    }

    fields.push('updated_at = ?');
    values.push(now, id);

    const sql = `UPDATE media SET ${fields.join(', ')} WHERE id = ?`;
    await this.run(sql, values);

    return this.getMediaById(id);
  }

  async deleteMedia(id: string): Promise<void> {
    const sql = 'DELETE FROM media WHERE id = ?';
    const result = await this.run(sql, [id]);
    
    if (result.changes === 0) {
      throw new Error('Media not found');
    }
  }

  // Text content operations
  async getTextContent(): Promise<TextContent[]> {
    const sql = 'SELECT * FROM text_content ORDER BY key';
    const rows = await this.all(sql);
    return rows.map(row => this.mapDatabaseTextContentToTextContent(row));
  }

  async getTextContentByKey(key: string): Promise<TextContent | null> {
    const sql = 'SELECT * FROM text_content WHERE key = ?';
    const row = await this.get(sql, [key]);
    
    if (!row) {
      return null;
    }

    return this.mapDatabaseTextContentToTextContent(row);
  }

  async updateTextContent(key: string, value: string): Promise<TextContent> {
    const now = new Date().toISOString();
    
    // Try to update first
    const updateSql = 'UPDATE text_content SET value = ?, updated_at = ? WHERE key = ?';
    const result = await this.run(updateSql, [value, now, key]);
    
    if (result.changes === 0) {
      // If no rows were updated, insert new record
      const insertSql = 'INSERT INTO text_content (key, value, created_at, updated_at) VALUES (?, ?, ?, ?)';
      await this.run(insertSql, [key, value, now, now]);
    }

    return this.getTextContentByKey(key) as Promise<TextContent>;
  }

  async updateMultipleTextContent(updates: { key: string; value: string }[]): Promise<TextContent[]> {
    const results = [];
    
    for (const update of updates) {
      const result = await this.updateTextContent(update.key, update.value);
      results.push(result);
    }
    
    return results;
  }

  // Helper methods
  private mapDatabaseMediaToMediaItem(row: DatabaseMediaItem): MediaItem {
    return {
      id: row.id,
      file_name: row.file_name,
      file_url: row.file_url,
      title: row.title,
      caption: row.caption,
      category: row.category,
      media_type: row.media_type as 'photo' | 'video' | 'reel',
      uploaded_at: row.uploaded_at,
      file_size: row.file_size,
      mime_type: row.mime_type,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  private mapDatabaseTextContentToTextContent(row: DatabaseTextContent): TextContent {
    return {
      id: row.id,
      key: row.key,
      value: row.value,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  // Close database connection
  close(): void {
    this.db.close();
  }
}

export default Database;
