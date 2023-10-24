import { Router } from 'express';
import CustomerController from '../../controllers/customer.controller';

// These are valid routes but they may contain a bug, please try to define and fix them

const router = Router();
// CUSTOMERS
// TODO: 5.1 - Create a new customer
router.post('/customers', CustomerController.create);
// TODO: 5.2 - Login a customer
router.post('/customers/login', CustomerController.login);
// TODO: 5.3 - Login a customer from facebook
router.get(' /customers/facebook', CustomerController.getCustomerProfile);
// TODO: 5.4 - Get customer by id
router.get('/customers/:customer_id', CustomerController.getCustomerProfile);
// TODO: 5.5 - Update customer details
router.put('/customer', CustomerController.apply);
// TODO: 5.6 - Update customer address
router.put('/customer/address', CustomerController.updateCustomerAddress);
// TODO: 5.7 - Update customer credit card
router.put('/customer/creditCard', CustomerController.updateCreditCard);

export default router;
