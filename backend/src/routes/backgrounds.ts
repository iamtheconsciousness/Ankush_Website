import { Router } from 'express';
import { BackgroundController } from '../controllers/backgroundController';
import { authenticateToken } from '../middleware/auth';

export function createBackgroundRoutes(): Router {
  const router = Router();
  const backgroundController = new BackgroundController();

  // Public routes (for frontend to fetch background images)
  router.get('/backgrounds/:sectionType', backgroundController.getBackgroundsBySectionType);
  router.get('/backgrounds', backgroundController.getAllBackgrounds);

  // Test endpoint
  router.post('/test-upload', 
    authenticateToken, 
    (req, res) => {
      console.log('Test upload endpoint hit');
      res.json({ success: true, message: 'Test endpoint working' });
    }
  );

  // Admin routes (require authentication)
  router.post('/admin/backgrounds', 
    authenticateToken, 
    (req, res, next) => {
      backgroundController.getUploadMiddleware()(req, res, next);
    },
    backgroundController.uploadBackgroundImage
  );
  
  router.delete('/admin/backgrounds/:id', 
    authenticateToken, 
    backgroundController.deleteBackgroundImage
  );

  return router;
}
