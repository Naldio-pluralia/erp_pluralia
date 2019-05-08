"use strict";
const Product = use("App/Models/Product");
const CardInput = use("App/Models/CardInput");
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

      allProds.push({ ...newProducts[i], _v: dateFns });
    }

    console.log(allProds);

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
  async remove({ request, view, session }) {
    const products = await Product.all();
    const requests = await ProductRequest.all();
    for (let r in requests) {
    }
    if (session.get("id") === request.params.id) {
      return view.render("school.inventory.stock.removeProduct", {
        id: session.get("id"),
        products: products.toJSON(),
        requests: requests.toJSON()
      });
    } else {
      session.put("id", request.params.id);
      return view.render("school.inventory.stock.removeProduct", {
        id: request.params.id,
        products: products.toJSON()
      });
    }
  }
  async requestProduct({ view, request, session }) {
    const products = await Product.all();
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
}

module.exports = LogisticController;
