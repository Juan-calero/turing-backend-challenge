import { Router } from 'express';
import TaxController from '../../controllers/tax.controller';

const router = Router();

// TAX
// 8.1 - All taxes
router.get('/tax', TaxController.getAllTax);
// 8.2 - Single tax
router.get('/tax/:tax_id', TaxController.getSingleTax);

export default router;
