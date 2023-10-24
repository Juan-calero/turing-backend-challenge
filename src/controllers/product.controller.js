/* eslint-disable camelcase */
/**
 * The Product controller contains all static methods that handles product request
 * Some methods work fine, some needs to be implemented from scratch while others may contain one or two bugs
 * The static methods and their function include:
 *
 * - getAllProducts - Return a paginated list of products
 * - searchProducts - Returns a list of product that matches the search query string
 * - getProductsByCategory - Returns all products in a product category
 * - getProductsByDepartment - Returns a list of products in a particular department
 * - getProduct - Returns a single product with a matched id in the request params
 * - getAllDepartments - Returns a list of all product departments
 * - getDepartment - Returns a single department
 * - getAllCategories - Returns all categories
 * - getSingleCategory - Returns a single category
 * - getProductCategory - Returns a single category from a product
 * - getDepartmentCategories - Returns all categories in a department
 *
 *  NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
import {
  Product,
  Department,
  AttributeValue,
  Attribute,
  ProductCategory,
  Category,
  Reviews,
  Sequelize,
  sequelize,
} from '../database/models';

const { Op } = Sequelize;

/**
 *
 *
 * @class ProductController
 */
class ProductController {
  /**
   * get all products
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async getAllProducts(req, res, next) {
    const { page = 1, limit = 20, description_length = 200 } = req.query;
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    const parsedDescriptionLength = parseInt(description_length, 10);

    try {
      const products = await Product.findAndCountAll({
        attributes: {
          include: [
            [
              sequelize.fn('LEFT', sequelize.col('description'), parsedDescriptionLength),
              'description',
            ],
          ],
        },
        limit: parsedLimit,
        offset: (page - 1) * limit,
      });
      const { count, rows } = products;
      return res.status(200).json({
        paginationMeta: {
          currentPage: parsedPage,
          currentPageSize: parsedLimit,
          totalPages: Math.ceil(count / parsedLimit),
          totalRecords: count,
        },
        rows,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * search all products
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async searchProduct(req, res, next) {
    const {
      page = 1,
      limit = 20,
      description_length = 200,
      query_string,
      all_words = 'off',
    } = req.query; // eslint-disable-line

    try {
      const searchProducts = await Product.findAll({
        where: {
          [Op.or]: {
            name: { [Op.substring]: query_string },
            ...(all_words === 'on' && { description: { [Op.substring]: query_string } }),
          },
        },
        attributes: {
          include: [
            [
              sequelize.fn('LEFT', sequelize.col('description'), parseInt(description_length, 10)),
              'description',
            ],
          ],
        },
        limit: parseInt(limit, 10),
        offset: (page - 1) * limit,
      });
      return res.status(200).json({ message: searchProducts });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get all products by caetgory
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async getProductsByCategory(req, res, next) {
    const { page = 1, limit = 20, description_length = 2 } = req.query;
    try {
      const { category_id } = req.params; // eslint-disable-line
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            where: { category_id },
            attributes: [],
            required: true,
          },
        ],
        attributes: {
          exclude: 'description',
          include: [
            [
              sequelize.fn('LEFT', sequelize.col('description'), parseInt(description_length, 10)),
              'description',
            ],
          ],
        },
        limit: parseInt(limit, 10),
        offset: (page - 1) * limit,
      });
      return res.status(200).json({ rows: products });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get all products by department
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async getProductsByDepartment(req, res, next) {
    const { department_id } = req.params;
    const { page = 1, limit = 20, description_length = 200 } = req.query;

    try {
      const productsInDepartment = await Product.findAll({
        include: [{ model: Category, where: { department_id }, attributes: [] }],
        attributes: {
          exclude: ['image', 'image_2', 'display'],
          include: [
            [
              sequelize.fn(
                'LEFT',
                sequelize.col('Product.description'),
                parseInt(description_length, 10)
              ),
              'description',
            ],
          ],
        },
        limit: parseInt(limit, 10),
        offset: (page - 1) * limit,
        subQuery: false,
      });
      return res.status(200).json({ rows: productsInDepartment });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get single product details
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product details
   * @memberof ProductController
   */
  static async getProduct(req, res, next) {
    const { product_id } = req.params; // eslint-disable-line
    const { description_length = 200 } = req.query; // eslint-disable-line
    try {
      const product = await Product.findByPk(product_id, {
        attributes: {
          include: [
            [
              sequelize.fn('LEFT', sequelize.col('description'), parseInt(description_length, 10)),
              'description',
            ],
          ],
        },
      });
      return res.status(200).json(product);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get all reviews of a product
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async getReviewsByProduct(req, res, next) {
    const { product_id } = req.params;
    const { page = 1, limit = 20, description_length = 200 } = req.query;

    try {
      const reviewsByProduct = await Reviews.findAll({
        include: [{ model: Category, where: { product_id }, attributes: [] }],
        attributes: {
          exclude: ['image', 'image_2', 'display'],
          include: [
            [
              sequelize.fn(
                'LEFT',
                sequelize.col('Product.description'),
                parseInt(description_length, 10)
              ),
              'description',
            ],
          ],
        },
        limit: parseInt(limit, 10),
        offset: (page - 1) * limit,
        subQuery: false,
      });
      return res.status(200).json({ rows: reviewsByProduct });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get all departments
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and department list
   * @memberof ProductController
   */
  static async getAllDepartments(req, res, next) {
    try {
      const departments = await Department.findAll();
      return res.status(200).json(departments);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get a single department
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getDepartment(req, res, next) {
    const { department_id } = req.params; // eslint-disable-line
    try {
      const department = await Department.findByPk(department_id);
      if (department) {
        return res.status(200).json(department);
      }
      return res.status(404).json({
        error: {
          status: 404,
          message: `Department with id ${department_id} does not exist`, // eslint-disable-line
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method should get all categories
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getAllCategories(req, res, next) {
    try {
      const categories = await Category.findAll();
      return res.status(200).json({ rows: categories });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method should get a single category using the categoryId
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getSingleCategory(req, res, next) {
    const { category_id } = req.params; // eslint-disable-line
    try {
      const category = await Category.findByPk(category_id);
      return res.status(200).json(category);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method should get single category in a product
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getProductCategory(req, res, next) {
    const { product_id } = req.params; // eslint-disable-line
    try {
      const categoryInProduct = await Category.findOne({
        include: {
          model: Product,
          where: { product_id },
          attributes: [],
        },
        attributes: { exclude: ['description'] },
      });
      return res.status(200).json(categoryInProduct);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method should get list of categories in a department
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getDepartmentCategories(req, res, next) {
    const { department_id } = req.params; // eslint-disable-line
    try {
      const categoriesInDepartment = await Category.findAll({ where: { department_id } });
      return res.status(200).json({ rows: categoriesInDepartment });
    } catch (error) {
      return next(error);
    }
  }
}

export default ProductController;
