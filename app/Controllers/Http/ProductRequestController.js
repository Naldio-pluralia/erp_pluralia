"use strict";
const Product = use("App/Models/Product");
const Order = use("App/Models/Order");
const ProductRequest = use("App/Models/ProductRequest");
const Mail = use("Mail");

class ProductRequestController {
  async addRequest({ view, session, request, response }) {
    try {
      const school_id = request.params.id;
      const { product_id } = request.only("product_id");
      const product = await Product.query()
        .where("id", "=", product_id)
        .where("school_id", "=", school_id)
        .fetch();
      const requestProduct = await ProductRequest.create(product.toJSON()[0]);
      session.flash({
        notification: "Produto adicionado com sucesso!",
        alert: "success"
      });
      return response.redirect(
        `/schools/${request.params.id}/logistic/products/request`
      );
    } catch (err) {
      session.flash({
        notification: "Produto já foi Requisitado",
        alert: "error"
      });
      return response.redirect(
        `/schools/${request.params.id}/logistic/products/request`
      );
    }
  }
  async sendRequest({ view, session, request, response }) {
    try {
      const school_id = request.params.id;
      const products = [];
      const ids = request.input("newId");
      const quantities = request.input("newQuantity");
      const prices = request.input("newPrice");
      for (let i = 0; i < ids.length; i++) {
        const product = await Product.query()
          .where("id", "=", ids[i])
          .where("school_id", "=", school_id)
          .fetch();

        console.log(product.toJSON()[0].name);

        const newProduct = new Order();
        newProduct.name = product.toJSON()[0].name;
        newProduct.category = product.toJSON()[0].category;
        newProduct.warehouse = product.toJSON()[0].warehouse;
        newProduct.quantity = Number(quantities[i]);
        newProduct.price = Number(prices[i]);
        newProduct.units = product.toJSON()[0].units;
        newProduct.stockMin = product.toJSON()[0].stockMin;
        newProduct.unitsMed = product.toJSON()[0].unitsMed;
        newProduct.school_id = school_id;
        await newProduct.save();

        console.log(newProduct.toJSON());

        // const requestProduct = await Orders.create(product.toJSON()[0]);
        products.push(newProduct.toJSON());
      }
      // console.log(products[0]);

      // Envio de emails
      const data = {
        user: {
          username: "Naldio Pluralia",
          email: "naldio.pluralia@gmail.com",
          password: "devnaldiopluralia"
        },
        products: products
      };

      await Mail.send("emails.products", data, message => {
        message
          .to(data.user.email)
          .from("naldio.pluralia@gmail.com")
          .subject("Envio da Lista de Produtos Requisitados");
      });
      // Fim do envio

      return response.redirect(
        `/schools/${request.params.id}/logistic/products/request`
      );
    } catch (err) {
      session.flash({ notification: "Impossivel enviar os pedidos!" });
      return response.redirect(
        `/schools/${request.params.id}/logistic/products/request`
      );
    }
  }
  async removeRequest({ view, session, request, response }) {
    const school_id = request.params.schoolId;
    const productId = request.params.productId;
    try {
      const product = await ProductRequest.query()
        .where("id", "=", productId, "&&", "schoolId", "=", school_id)
        .delete();

      session.flash({
        notification: "Produto removido com sucesso!",
        alert: "success"
      });

      return response.redirect(
        `/schools/${school_id}/logistic/products/request`
      );
    } catch (err) {
      session.flash({
        notification: "Impossivel remover o produto",
        alert: "error"
      });
      return response.redirect(
        `/schools/${school_id}/logistic/products/request`
      );
    }
  }
}

module.exports = ProductRequestController;
