"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with products
 */
const Product = use("App/Models/Product");
const Stock = use("App/Models/Stock");

const { validate } = use("Validator");

class ProductController {
  async store({ view, request, response, session }) {
    const rules = {
      name: "required",
      quantity: "required",
      stockMin: "required"
    };

    const validation = await validate(
      request.only(["name", "quantity", "stockMin"]),
      rules
    );

    if (validation.fails()) {
      session.withErrors(validation.messages());

      return response.redirect("back");
    }

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

  async showProduct({ view, request, response, session, params }) {
    const product = await Product.query()
      .where("id", params.productId)
      .where("school_id", params.schoolId)
      .first();

    const stock = await Stock.query()
      .where("product_id", params.productId)
      .where("school_id", params.schoolId)
      .first();

    const { initialStock, inputStock, outputStock, finalStock } = stock;

    if (session.get("id") === request.params.id) {
      return view.render("school.inventory.product.details", {
        id: session.get("id"),
        product: product.toJSON(),
        initialStock,
        inputStock: 0,
        outputStock: 0,
        finalStock
      });
    } else {
      session.put("id", request.params.id);
      return view.render("school.inventory.product.details", {
        id: request.params.id,
        product: product.toJSON(),
        initialStock,
        inputStock,
        outputStock,
        finalStock
      });
    }
  }
}

module.exports = ProductController;
