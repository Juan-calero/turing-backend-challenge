import { Router } from 'express';
import ShoppingCartController from '../../controllers/shoppingCart.controller';

const router = Router();
// SHOPPING CART
// 7.1 - Cart unique Id
router.get('/shoppingcart/generateUniqueId', ShoppingCartController.generateUniqueCart);
// TODO: 7.2 - Add item to cart
router.post('/shoppingcart/add', ShoppingCartController.addItemToCart);
// TODO: 7.3 - All products in cart
router.get('/shoppingcart/:cart_id', ShoppingCartController.getCart);
// TODO: 7.4 - All item quantity in cart
router.put('/shoppingcart/update/:item_id', ShoppingCartController.updateCartItem);
// TODO: 7.5 - Empty cart
router.delete('/shoppingcart/empty/:cart_id', ShoppingCartController.emptyCart);
// TODO: 7.6 - Remove item from cart
router.delete('/shoppingcart/removeProduct/:item_id', ShoppingCartController.removeItemFromCart);

// ORDERS
// TODO: 6.1 - Create an order
router.post('/orders', ShoppingCartController.createOrder);
// TODO: 6.2 - Get an order
router.get('/orders/:order_id', ShoppingCartController.getOrderSummary);
// TODO: 6.3 - Get a customer's orders
router.get('/orders/inCustomer', ShoppingCartController.getCustomerOrders);
// TODO: 6.4 - Get short details of an order
router.post('/orders/shortDetail/:order_id', ShoppingCartController.processStripePayment);

// STRIPE
// TODO: 10.1 - Post payment to stripe
router.post('/stripe/charge', ShoppingCartController.processStripePayment);

export default router;
