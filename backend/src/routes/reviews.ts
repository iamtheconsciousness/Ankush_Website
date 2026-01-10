import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController';
import { authenticateToken } from '../middleware/auth';

export function createReviewRoutes(): Router {
  const router = Router();
  const reviewController = new ReviewController();

  // Public routes
  router.post('/reviews', reviewController.submitReview);
  router.get('/reviews/approved', reviewController.getApprovedReviews);

  // Admin routes (require authentication)
  router.get('/admin/reviews', 
    authenticateToken, 
    reviewController.getAllReviews
  );
  
  router.get('/admin/reviews/:id', 
    authenticateToken, 
    reviewController.getReviewById
  );
  
  router.put('/admin/reviews/:id/status', 
    authenticateToken, 
    reviewController.updateReviewStatus
  );
  
  router.delete('/admin/reviews/:id', 
    authenticateToken, 
    reviewController.deleteReview
  );

  return router;
}