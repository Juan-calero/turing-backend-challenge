import { Router } from 'express';
import ShippingController from '../../controllers/shipping.controller';

const router = Router();

// SHIPPING
// 9.1 - All shipping regions
router.get('/shipping/regions', ShippingController.getShippingRegions);
// 9.1 - All shippings in a region
router.get('/shipping/regions/:shipping_region_id', ShippingController.getShippingType);

export default router;
