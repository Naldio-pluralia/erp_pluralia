"use strict";
const Product = use("App/Models/Product");
const CardInput = use("App/Models/CardInput");
const CardOutput = use("App/Models/CardOutput");
const ProductRequest = use("App/Models/ProductRequest");
const Order = use("App/Models/Order");
const Stock = use("App/Models/Stock");
const { distanceInWords } = require("date-fns");
const pt = require("date-fns/locale/pt");

class LogisticController {
  async index({ request, view, session, params }) {
    const products = await Product.query()
      .where("school_id", params.id)
      .fetch();
    const newProducts = [...products.toJSON()];

    let allProds = [];
    for (let i = 0; i < newProducts.length; i++) {
      let dateFns = distanceInWords(newProducts[i].created_at, new Date(), {
        locale: pt
      });

      let stock = await Stock.query()
        .where("product_id", newProducts[i].id)
        .first();

      allProds.push({
        ...newProducts[i],
        _v: dateFns,
        initialStock: stock.initialStock,
        inputStock: stock.inputStock,
        outputStock: stock.outputStock,
        finalStock: stock.finalStock
      });
    }

    if (session.get("id") === request.params.id) {
      return view.render("school.inventory.index", {
        id: session.get("id"),
        products: allProds
      });
    } else {
      session.put("id", request.params.id);
      return view.render("school.inventory.index", {
        id: request.params.id,
        products: allProds
      });
    }
  }
  async add({ request, view, session, params }) {
    const products = await Product.query()
      .where("school_id", params.id)
      .fetch();
    const productsCardInputs = await CardInput.all();

    if (session.get("id") === request.params.id) {
      return view.render("school.inventory.stock.addProduct", {
        id: session.get("id"),
        products: products.toJSON(),
        productsCardInputs: productsCardInputs.toJSON()
      });
    } else {
      session.put("id", request.params.id);
      return view.render("school.inventory.stock.addProduct", {
        id: request.params.id,
        products: products.toJSON(),
        productsCardInputs: productsCardInputs.toJSON()
      });
    }
  }
  async remove({ request, view, session, params }) {
    const products = await Product.query()
      .where("school_id", params.id)
      .fetch();
    const productsCardOutputs = await CardOutput.all();
    if (session.get("id") === request.params.id) {
      return view.render("school.inventory.stock.removeProduct", {
        id: session.get("id"),
        products: products.toJSON(),
        productsCardOutputs: productsCardOutputs.toJSON()
      });
    } else {
      session.put("id", request.params.id);
      return view.render("school.inventory.stock.removeProduct", {
        id: request.params.id,
        products: products.toJSON(),
        productsCardOutputs: productsCardOutputs.toJSON()
      });
    }
  }
  async requestProduct({ view, request, session, params }) {
    const products = await Product.query()
      .where("school_id", params.id)
      .fetch();
    const requests = await ProductRequest.all();
    for (let r in requests) {
    }
    if (session.get("id") === request.params.id) {
      return view.render("school.inventory.request.new", {
        id: session.get("id"),
        products: products.toJSON(),
        requests: requests.toJSON()
      });
    } else {
      session.put("id", request.params.id);
      return view.render("school.inventory.request.new", {
        id: request.params.id,
        products: products.toJSON()
      });
    }
  }
  async orderProduct({ view, request, session, params }) {
    const products = await Order.query()
      .where("school_id", params.id)
      .fetch();

    if (session.get("id") === request.params.id) {
      return view.render("school.inventory.orders.new", {
        id: session.get("id"),
        products: products.toJSON()
      });
    } else {
      session.put("id", request.params.id);
      return view.render("school.inventory.orders.new", {
        id: request.params.id,
        products: products.toJSON()
      });
    }
  }
  async create({ view, request, session }) {
    if (session.get("id") === request.params.id) {
      return view.render("school.inventory.product.new", {
        id: session.get("id")
      });
    } else {
      session.put("id", request.params.id);
      return view.render("school.inventory.product.new", {
        id: request.params.id
      });
    }
  }

  async clearShopping({ params, response, session }) {
    await Order.query().delete();

    session.flash({
      notification: "Produtos removidos com sucesso!",
      alert: "success"
    });

    return response.redirect("back");
  }
}

module.exports = LogisticController;
