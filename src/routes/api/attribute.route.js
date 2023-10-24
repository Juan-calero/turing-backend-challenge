import { Router } from 'express';
import AttributeController from '../../controllers/attributes.controller';

const router = Router();

// ATTRIBUTES
// 3.1 - All attributes
router.get('/attributes', AttributeController.getAllAttributes);
// 3.2 - Single attribute
router.get('/attributes/:attribute_id', AttributeController.getSingleAttribute);
// 3.3 - All attributes values in an attribute
router.get('/attributes/values/:attribute_id', AttributeController.getAttributeValues);
// 3.4 - All attributes of a product
router.get('/attributes/inProduct/:product_id', AttributeController.getProductAttributes);

export default router;
