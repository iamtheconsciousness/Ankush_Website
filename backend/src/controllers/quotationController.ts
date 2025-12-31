import { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { ApiResponse, QuotationRequest, Quotation } from '../types';

export class QuotationController {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');
    this.db = new sqlite3.Database(dbPath);
  }

  public submitQuotation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, phone, eventDate, location, message, service }: QuotationRequest = req.body;

      // Validate required fields
      if (!name || !email || !phone || !eventDate || !location || !message || !service) {
        res.status(400).json({
          success: false,
          message: 'All fields are required'
        } as ApiResponse);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        } as ApiResponse);
        return;
      }

      // Validate phone format (basic validation)
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(phone)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid phone number'
        } as ApiResponse);
        return;
      }

      // Insert quotation into database
      const sql = `
        INSERT INTO quotations (name, email, phone, event_date, location, message, service, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
      `;

      this.db.run(sql, [name, email, phone, eventDate, location, message, service], function(err) {
        if (err) {
          console.error('Error inserting quotation:', err);
          res.status(500).json({
            success: false,
            message: 'Failed to submit quotation'
          } as ApiResponse);
          return;
        }

        res.status(201).json({
          success: true,
          message: 'Quotation submitted successfully',
          data: {
            id: this.lastID,
            name,
            email,
            phone,
            eventDate,
            location,
            message,
            service,
            status: 'pending'
          }
        } as ApiResponse);
      });
    } catch (error) {
      console.error('Error submitting quotation:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  };

  public getAllQuotations = async (req: Request, res: Response): Promise<void> => {
    try {
      const sql = `
        SELECT id, name, email, phone, event_date as eventDate, location, message, service, status, created_at as createdAt, updated_at as updatedAt
        FROM quotations
        ORDER BY created_at DESC
      `;

      this.db.all(sql, [], (err, rows: any[]) => {
        if (err) {
          console.error('Error fetching quotations:', err);
          res.status(500).json({
            success: false,
            message: 'Failed to fetch quotations'
          } as ApiResponse);
          return;
        }

        res.json({
          success: true,
          data: rows,
          message: 'Quotations fetched successfully'
        } as ApiResponse<Quotation[]>);
      });
    } catch (error) {
      console.error('Error fetching quotations:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  };

  public getQuotationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const sql = `
        SELECT id, name, email, phone, event_date as eventDate, location, message, service, status, created_at as createdAt, updated_at as updatedAt
        FROM quotations
        WHERE id = ?
      `;

      this.db.get(sql, [id], (err, row: any) => {
        if (err) {
          console.error('Error fetching quotation:', err);
          res.status(500).json({
            success: false,
            message: 'Failed to fetch quotation'
          } as ApiResponse);
          return;
        }

        if (!row) {
          res.status(404).json({
            success: false,
            message: 'Quotation not found'
          } as ApiResponse);
          return;
        }

        res.json({
          success: true,
          data: row,
          message: 'Quotation fetched successfully'
        } as ApiResponse<Quotation>);
      });
    } catch (error) {
      console.error('Error fetching quotation:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  };

  public updateQuotationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['pending', 'contacted', 'completed'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status. Must be pending, contacted, or completed'
        } as ApiResponse);
        return;
      }

      const sql = `
        UPDATE quotations 
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      this.db.run(sql, [status, id], function(err) {
        if (err) {
          console.error('Error updating quotation status:', err);
          res.status(500).json({
            success: false,
            message: 'Failed to update quotation status'
          } as ApiResponse);
          return;
        }

        if (this.changes === 0) {
          res.status(404).json({
            success: false,
            message: 'Quotation not found'
          } as ApiResponse);
          return;
        }

        res.json({
          success: true,
          message: 'Quotation status updated successfully'
        } as ApiResponse);
      });
    } catch (error) {
      console.error('Error updating quotation status:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  };

  public deleteQuotation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const sql = 'DELETE FROM quotations WHERE id = ?';

      this.db.run(sql, [id], function(err) {
        if (err) {
          console.error('Error deleting quotation:', err);
          res.status(500).json({
            success: false,
            message: 'Failed to delete quotation'
          } as ApiResponse);
          return;
        }

        if (this.changes === 0) {
          res.status(404).json({
            success: false,
            message: 'Quotation not found'
          } as ApiResponse);
          return;
        }

        res.json({
          success: true,
          message: 'Quotation deleted successfully'
        } as ApiResponse);
      });
    } catch (error) {
      console.error('Error deleting quotation:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse);
    }
  };
}
