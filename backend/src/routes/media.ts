import { Router } from 'express';
import multer from 'multer';
import { MediaController } from '../controllers/mediaController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const mediaController = new MediaController();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Public routes (for frontend display)
router.get('/', (req, res) => mediaController.getAllMedia(req, res));
router.get('/category/:category', (req, res) => mediaController.getMediaByCategory(req, res));
router.get('/:id', (req, res) => mediaController.getMediaById(req, res));

// Protected routes (require authentication)
router.post('/upload', authenticateToken, upload.single('file'), (req, res) => 
  mediaController.uploadMedia(req, res)
);
router.put('/:id', authenticateToken, (req, res) => 
  mediaController.updateMedia(req, res)
);
router.delete('/:id', authenticateToken, (req, res) => 
  mediaController.deleteMedia(req, res)
);

export default router;
