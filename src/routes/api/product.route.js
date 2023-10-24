import { Router } from 'express';
import ProductController from '../../controllers/product.controller';

// These are valid routes but they may contain a bug, please try to define and fix them

const router = Router();
// PRODUCTS
// 4.1 - All products
router.get('/products', ProductController.getAllProducts);
// 4.2 - Search products
router.get('/products/search', ProductController.searchProduct);
// 4.3 - Single product
router.get('/products/:product_id', ProductController.getProduct);
// 4.4 - All products in category
router.get('/products/inCategory/:category_id', ProductController.getProductsByCategory);
// 4.5 - All products in department
router.get('/products/inDepartment/:department_id', ProductController.getProductsByDepartment);
// TODO: 4.6 - Reviews of a product
router.get('/products/:product_id/reviews', ProductController.getReviewsByProduct);
// TODO: 4.7 - Post a product review
router.post('/products/:product_id/reviews', ProductController.getProductsByDepartment);

// DEPARTMENTS
// 1.1 - All departments
router.get('/departments', ProductController.getAllDepartments);
// 1.2 - Single department
router.get('/departments/:department_id', ProductController.getDepartment);

// CATEGORIES
// 2.1 - All categories
router.get('/categories', ProductController.getAllCategories);
// 2.2 - Single category
router.get('/categories/:category_id', ProductController.getSingleCategory);
// 2.3 - Category in a product
router.get('/categories/inProduct/:product_id', ProductController.getProductCategory);
// 2.4 - Categories in a department
router.get('/categories/inDepartment/:department_id', ProductController.getDepartmentCategories);

export default router;
