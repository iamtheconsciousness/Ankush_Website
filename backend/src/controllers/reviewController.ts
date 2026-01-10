import { Request, Response } from 'express';
import Database from '../db/database';
import { ApiResponse, ReviewRequest, Review } from '../types';

export class ReviewController {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  public submitReview = async (req: Request, res: Response): Promise<void> => {
    try {
      const { client_name, email, rating, comment }: ReviewRequest = req.body;

      // Validate required fields
      if (!client_name || !email || !rating || !comment) {
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

      // Validate rating (1-5)
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        res.status(400).json({
          success: false,
          message: 'Rating must be an integer between 1 and 5'
        } as ApiResponse);
        return;
      }

      // Validate comment length
      if (comment.trim().length < 10) {
        res.status(400).json({
          success: false,
          message: 'Comment must be at least 10 characters long'
        } as ApiResponse);
        return;
      }

      // Create review in database
      const review = await this.db.createReview({
        client_name: client_name.trim(),
        email: email.trim().toLowerCase(),
        rating,
        comment: comment.trim()
      });

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully. It will be published after approval.',
        data: review
      } as ApiResponse<Review>);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to submit review'
      } as ApiResponse);
    }
  };

  public getAllReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const status = req.query.status as 'pending' | 'approved' | 'rejected' | undefined;
      const reviews = await this.db.getAllReviews(status);

      res.json({
        success: true,
        data: reviews,
        message: 'Reviews retrieved successfully'
      } as ApiResponse<Review[]>);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch reviews'
      } as ApiResponse);
    }
  };

  public getApprovedReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const reviews = await this.db.getApprovedReviews();

      res.json({
        success: true,
        data: reviews,
        message: 'Approved reviews retrieved successfully'
      } as ApiResponse<Review[]>);
    } catch (error: any) {
      console.error('Error fetching approved reviews:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch approved reviews'
      } as ApiResponse);
    }
  };

  public getReviewById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid review ID'
        } as ApiResponse);
        return;
      }

      const review = await this.db.getReviewById(id);

      res.json({
        success: true,
        data: review,
        message: 'Review retrieved successfully'
      } as ApiResponse<Review>);
    } catch (error: any) {
      console.error('Error fetching review:', error);
      
      if (error.message === 'Review not found') {
        res.status(404).json({
          success: false,
          message: 'Review not found'
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch review'
      } as ApiResponse);
    }
  };

  public updateReviewStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid review ID'
        } as ApiResponse);
        return;
      }

      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: pending, approved, rejected'
        } as ApiResponse);
        return;
      }

      const review = await this.db.updateReviewStatus(id, status);

      res.json({
        success: true,
        data: review,
        message: `Review status updated to ${status} successfully`
      } as ApiResponse<Review>);
    } catch (error: any) {
      console.error('Error updating review status:', error);
      
      if (error.message === 'Review not found') {
        res.status(404).json({
          success: false,
          message: 'Review not found'
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update review status'
      } as ApiResponse);
    }
  };

  public deleteReview = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid review ID'
        } as ApiResponse);
        return;
      }

      await this.db.deleteReview(id);

      res.json({
        success: true,
        message: 'Review deleted successfully'
      } as ApiResponse);
    } catch (error: any) {
      console.error('Error deleting review:', error);
      
      if (error.message === 'Review not found') {
        res.status(404).json({
          success: false,
          message: 'Review not found'
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete review'
      } as ApiResponse);
    }
  };
}