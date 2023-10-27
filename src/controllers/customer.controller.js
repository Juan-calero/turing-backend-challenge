/* eslint-disable camelcase */
/**
 * Customer controller handles all requests that has to do with customer
 * Some methods needs to be implemented from scratch while others may contain one or two bugs
 *
 * - create - allow customers to create a new account
 * - login - allow customers to login to their account
 * - getCustomerProfile - allow customers to view their profile info
 * - updateCustomerProfile - allow customers to update their profile info like name, email, password, day_phone, eve_phone and mob_phone
 * - updateCustomerAddress - allow customers to update their address info
 * - updateCreditCard - allow customers to update their credit card number
 *
 *  NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
import { Customer } from '../database/models';

/**
 *
 *
 * @class CustomerController
 */
class CustomerController {
  /**
   * create a customer record
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status, customer data and access token
   * @memberof CustomerController
   */
  static async create(req, res, next) {
    try {
      const { name, email, password } = req.body;
      // eslint-disable-next-line camelcase
      const [{ customer_id, shipping_region_id }, created] = await Customer.create({
        name,
        email,
        password,
      });
      return created
        ? res.status(201).json({
            customer: {
              customer_id,
              name,
              email,
              address_1: null,
              address_2: null,
              city: null,
              region: null,
              postal_code: null,
              shipping_region_id,
              credit_card: null,
              day_phone: null,
              eve_phone: null,
              mob_phone: null,
            },
            /*     accessToken: string,
              expiresIn: string, */
          })
        : res.status(500).json({});
    } catch (error) {
      return next(error);
    }
  }

  /**
   * log in a customer
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status, and access token
   * @memberof CustomerController
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const customer = await Customer.findOne({ where: { email } });

      const isValidPassword = await customer.validatePassword(password);

      return isValidPassword
        ? res.status(200).json({ customer })
        : res.status(401).json({ code: 'login_failure', message: 'incorrect email or password' });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get customer profile data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async getCustomerProfile(req, res, next) {
    // fix the bugs in this code
    const { customer_id } = req.params;
    try {
      const customer = await Customer.findByPk(customer_id, {
        attributes: { exclude: ['password', 'country', 'credit_card'] },
      });
      return res.status(200).json(customer);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer profile data such as name, email, password, day_phone, eve_phone and mob_phone
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCustomerProfile(req, res, next) {
    try {
      const { email, name, day_phone, eve_phone, mob_phone } = req.body;
      const customer = await Customer.findOne({
        where: { email },
        attributes: { exclude: ['password', 'country', 'credit_card'] },
      });
      customer.name = name || customer.name;
      customer.day_phone = day_phone || null;
      customer.eve_phone = eve_phone || null;
      customer.mob_phone = mob_phone || null;
      await customer.save();

      return res.status(200).json(customer);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer profile data such as address_1, address_2, city, region, postal_code, country and shipping_region_id
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCustomerAddress(req, res, next) {
    try {
      const {
        email,
        address_1,
        address_2,
        city,
        region,
        postal_code,
        shipping_region_id,
        country,
      } = req.body;

      const parsedRegionId = parseInt(shipping_region_id, 10);

      if (Number.isNaN(parsedRegionId))
        return res.status(400).json({ message: 'shipping_region_id needs to be a number' });

      const customer = await Customer.findOne({
        where: { email },
        attributes: { exclude: ['password', 'credit_card'] },
      });
      customer.address_1 = address_1 || null;
      customer.address_2 = address_2 || null;
      customer.country = country || null;
      customer.city = city || null;
      customer.region = region || null;
      customer.postal_code = postal_code || null;
      customer.shipping_region_id = parsedRegionId || 1;
      await customer.save();

      return res.status(200).json(customer);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer credit card
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCreditCard(req, res, next) {
    try {
      const { credit_card, email } = req.body;
      const parsedCreditCard = parseInt(credit_card, 10);
      const stringifiedCreditCard = credit_card.toString();

      if (
        Number.isNaN(parsedCreditCard) ||
        stringifiedCreditCard.length !== 16 ||
        !stringifiedCreditCard.endsWith('7890')
      )
        return res.status(400).json({ message: 'please enter a valid credit card' });

      const customer = await Customer.findOne({
        where: { email },
        attributes: { exclude: ['password', 'country'] },
      });
      customer.credit_card = stringifiedCreditCard || null;
      await customer.save();
      return res.status(200).json(customer);
    } catch (error) {
      return next(error);
    }
  }
}

export default CustomerController;
