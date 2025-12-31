import { Router } from 'express';
import { TextContentController } from '../controllers/textContentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const textContentController = new TextContentController();

// Public routes (for frontend display)
router.get('/', (req, res) => textContentController.getTextContent(req, res));
router.get('/:key', (req, res) => textContentController.getTextContentByKey(req, res));

// Protected routes (require authentication)
router.put('/', authenticateToken, (req, res) => 
  textContentController.updateTextContent(req, res)
);
router.put('/multiple', authenticateToken, (req, res) => 
  textContentController.updateMultipleTextContent(req, res)
);

export default router;
