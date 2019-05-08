"use strict";

const Product = use("App/Models/Product");
const Stock = use("App/Models/Stock");
const CardInput = use("App/Models/CardInput");

class StockController {
  async addStock({ params, request, response, session }) {
    const school_id = params.id;

    const product = await Stock.query()
      .where("school_id", school_id)
      .first();

    const p = await Product.query()
      .where("id", product.product_id)
      .where("school_id", school_id)
      .first();

    if (await CardInput.findBy("product_id", p.id)) {
      session.flash({
        notification: "Produto já foi adicionado!",
        alert: "error"
      });
      return response.redirect("back");
    }

    await CardInput.create({
      name: p.toJSON().name,
      warehouse: p.toJSON().warehouse,
      category: p.toJSON().category,
      quantity: p.toJSON().quantity,
      units: p.toJSON().units,
      product_id: p.toJSON().id
    });

    return response.redirect("back");
  }

  async removeStock({ request, params, response, session }) {
    const product_id = params.productId;
    const cardItem = await CardInput.query()
      .where("product_id", product_id)
      .delete();

    session.flash({
      notification: "Produto removido com sucesso!",
      alert: "success"
    });

    return response.redirect("back");
  }
}

module.exports = StockController;
