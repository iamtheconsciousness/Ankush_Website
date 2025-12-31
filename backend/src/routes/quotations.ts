import { Router } from 'express';
import { QuotationController } from '../controllers/quotationController';
import { authenticateToken } from '../middleware/auth';

export function createQuotationRoutes(): Router {
  const router = Router();
  const quotationController = new QuotationController();

  // Public route for submitting quotations
  router.post('/quotations', quotationController.submitQuotation);

  // Admin routes (require authentication)
  router.get('/admin/quotations', 
    authenticateToken, 
    quotationController.getAllQuotations
  );
  
  router.get('/admin/quotations/:id', 
    authenticateToken, 
    quotationController.getQuotationById
  );
  
  router.put('/admin/quotations/:id/status', 
    authenticateToken, 
    quotationController.updateQuotationStatus
  );
  
  router.delete('/admin/quotations/:id', 
    authenticateToken, 
    quotationController.deleteQuotation
  );

  return router;
}
