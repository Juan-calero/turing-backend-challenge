import { AttributeValue, Attribute, ProductAttribute } from '../database/models';

/**
 * The controller defined below is the attribute controller, highlighted below are the functions of each static method
 * in the controller
 *  Some methods needs to be implemented from scratch while others may contain one or two bugs
 *
 * - getAllAttributes - This method should return an array of all attributes
 * - getSingleAttribute - This method should return a single attribute using the attribute_id in the request parameter
 * - getAttributeValues - This method should return an array of all attribute values of a single attribute using the attribute id
 * - getProductAttributes - This method should return an array of all the product attributes
 * NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
class AttributeController {
  /**
   * This method get all attributes
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getAllAttributes(req, res, next) {
    try {
      const attributes = await Attribute.findAll();
      return res.status(200).json(attributes);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method gets a single attribute using the attribute id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getSingleAttribute(req, res, next) {
    const { attribute_id } = req.params; // eslint-disable-line
    try {
      const attribute = await Attribute.findByPk(attribute_id);
      return res.status(200).json(attribute);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method gets a list attribute values in an attribute using the attribute id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getAttributeValues(req, res, next) {
    const { attribute_id } = req.params; // eslint-disable-line
    try {
      const valuesByAttribute = await AttributeValue.findAll({ where: { attribute_id } });
      return res.status(200).json(valuesByAttribute);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method gets a list attribute values in a product using the product id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getProductAttributes(req, res, next) {
    const { product_id } = req.params; // eslint-disable-line
    try {
      const productAttributes = await ProductAttribute.findAll({
        where: { product_id },
        include: [
          {
            model: AttributeValue,
            attributes: ['value'],
            include: [{ model: Attribute, as: 'attribute_type', attributes: ['name'] }],
          },
        ],
        attributes: { exclude: ['product_id'] },
        raw: true,
      });
      const mapProductAttributes = productAttributes.map(attribute => ({
        attribute_name: attribute['AttributeValue.attribute_type.name'],
        attribute_value: attribute['AttributeValue.value'],
        attribute_value_id: attribute.attribute_value_id,
      }));

      return res.status(200).json(mapProductAttributes);
    } catch (error) {
      return next(error);
    }
  }
}

export default AttributeController;
