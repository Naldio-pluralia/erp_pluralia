"use strict";

const Product = use("App/Models/Product");
const Stock = use("App/Models/Stock");
const CardInput = use("App/Models/CardInput");
const CardOutput = use("App/Models/CardOutput");

class StockController {
  async addStock({ params, request, response, session }) {
    const school_id = params.id;

    const product = await Stock.query()
      .where("product_id", request.input("product_id"))
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
  async remStock({ params, request, response, session }) {
    const school_id = params.id;

    const product = await Stock.query()
      .where("product_id", request.input("product_id"))
      .first();

    const p = await Product.query()
      .where("id", product.product_id)
      .where("school_id", school_id)
      .first();

    if (await CardOutput.findBy("product_id", p.id)) {
      session.flash({
        notification: "Produto já foi adicionado!",
        alert: "error"
      });
      return response.redirect("back");
    }

    await CardOutput.create({
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
  async removeItemStock({ request, params, response, session }) {
    const product_id = params.productId;
    const cardItem = await CardOutput.query()
      .where("product_id", product_id)
      .delete();

    session.flash({
      notification: "Produto removido com sucesso!",
      alert: "success"
    });

    return response.redirect("back");
  }

  async remInStock({ params, request, response, session }) {
    const schoolId = params.id;
    const ids = request.input("newId");
    const quantites = request.input("newQuantity");
    const unities = request.input("newUnits");
    console.log(ids, quantites, unities);

    for (let i = 0; i < ids.length; i++) {
      let item = await Stock.query()
        .where("product_id", ids[i])
        .where("school_id", schoolId)
        .first();

      if (Number(quantites[i]) > item.initialStock + item.inputStock) {
        session.flash({
          notification:
            "Por favor verifique os valores não podem ser maiores que o stock",
          alert: "error"
        });
        return response.redirect("back");
      }

      if (Number(quantites[i]) <= 0) {
        session.flash({
          notification:
            "Por favor verifique os valores não podem ser negativos ou igual a 0",
          alert: "error"
        });
        return response.redirect("back");
      }

      item.outputStock = item.outputStock + Number(quantites[i]);
      await item.save();
      item.finalStock = item.initialStock + item.inputStock - item.outputStock;
      await item.save();
    }

    session.flash({
      notification: "Produtos removidos com sucesso!",
      alert: "success"
    });

    for (let i = 0; i < ids.length; i++) {
      await CardOutput.query()
        .where("product_id", ids[i])
        .delete();
    }

    return response.redirect("back");
  }
  async addInStock({ params, request, response, session }) {
    const schoolId = params.id;
    const ids = request.input("newId");
    const quantites = request.input("newQuantity");
    const unities = request.input("newUnits");
    console.log(ids, quantites, unities);

    for (let i = 0; i < ids.length; i++) {
      let item = await Stock.query()
        .where("product_id", ids[i])
        .where("school_id", schoolId)
        .first();

      item.inputStock = item.inputStock + Number(quantites[i]);
      await item.save();
      item.finalStock = item.initialStock + item.inputStock - item.outputStock;
      await item.save();
    }

    session.flash({
      notification: "Produtos adicionados com sucesso!",
      alert: "success"
    });

    for (let i = 0; i < ids.length; i++) {
      await CardInput.query()
        .where("product_id", ids[i])
        .delete();
    }

    return response.redirect("back");
  }
}

module.exports = StockController;
