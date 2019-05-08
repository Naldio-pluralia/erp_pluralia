"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with products
 */
const Product = use("App/Models/Product");
const Stock = use("App/Models/Stock");

class ProductController {
  async store({ view, request, response }) {
    const {
      category,
      name,
      price,
      quantity,
      school_id,
      stockMin,
      units,
      unitsMed,
      warehouse
    } = request.all();

    const product = await Product.create({
      category,
      name,
      price,
      quantity,
      school_id,
      stockMin,
      units,
      unitsMed,
      warehouse
    });

    const input = 0;
    const output = 0;
    const stock = await Stock.create({
      product_id: product.id,
      school_id: school_id,
      initialStock: product.quantity,
      inputStock: 0,
      outputStock: 0,
      finalStock: product.quantity + input - output
    });

    return response.redirect(`/schools/${request.params.id}/logistic/products`);
  }
}

module.exports = ProductController;
