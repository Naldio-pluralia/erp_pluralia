"use strict";
const Product = use("App/Models/Product");
const Order = use("App/Models/Order");
const Stock = use("App/Models/Stock");
const ProductRequest = use("App/Models/ProductRequest");
const Mail = use("Mail");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("../../Helpers/PDFDocumentWithTables");
const blobStream = require("blob-stream");
const uuid = require("uuid");
const Helpers = use("Helpers");

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
      let allProducts = [];
      const school_id = request.params.id;
      const products = [];
      const ids = request.input("newId");
      const quantities = request.input("newQuantity");
      const units = request.input("newUnits");
      const prices = request.input("newPrice");
      for (let i = 0; i < ids.length; i++) {
        const product = await Product.query()
          .where("id", "=", ids[i])
          .where("school_id", "=", school_id)
          .fetch();

        const newProduct = new Order();
        newProduct.productID = Number(ids[i]);
        newProduct.name = product.toJSON()[0].name;
        newProduct.category = product.toJSON()[0].category;
        newProduct.warehouse = product.toJSON()[0].warehouse;
        newProduct.quantity = Number(quantities[i]);
        newProduct.price = Number(prices[i]);
        newProduct.units = product.toJSON()[0].units;
        newProduct.stockMin = product.toJSON()[0].stockMin;
        newProduct.unitsMed = product.toJSON()[0].unitsMed;
        newProduct.stockLevel =
          Number(quantities[i]) > product.toJSON()[0].stockMin
            ? 2
            : Number(quantities[i]) === product.toJSON()[0].stockMin
            ? 1
            : 0;
        newProduct.school_id = school_id;
        await newProduct.save();

        products.push(newProduct.toJSON());
      }

      // Envio de emails
      const data = {
        user: {
          username: "Naldio Pluralia",
          email: "ncjdev@gmail.com",
          password: "devnaldiopluralia"
        },
        products: products
      };

      for (let i = 0; i < products.length; i++) {
        let product = await Product.findBy({ id: products[i].productID });
        allProducts.push([
          product.name,
          quantities[i],
          units[i],
          product.stockLevel
        ]);
      }

      var doc = new PDFDocument();
      var stream = doc.pipe(blobStream());
      var codeGenerate = uuid.v4();

      doc.pipe(
        fs.createWriteStream(
          path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "public",
            "attachment",
            "produtosReq" + codeGenerate + ".pdf"
          )
        )
      );

      doc.image(
        path.resolve(__dirname, "..", "..", "..", "public", "img", "logo.png"),
        18,
        50,
        { width: 105 }
      );

      // Embed a font, set the font size, and render some text
      doc.fontSize(14).text("Lista de Produtos Requisitados", 50, 120, {
        align: "center"
      });

      const table0 = {
        headers: ["Nome", "Quantidades", "Unidades", "Nível de Stock"],
        rows: allProducts
      };

      doc.table(table0, 75, 150, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(6),
        prepareRow: (row, i) => doc.font("Helvetica").fontSize(6)
      });

      const table1 = {
        headers: ["Country", "Conversion rate", "Trend"],
        rows: [
          ["Switzerland", "12%", "+1.12%"],
          ["France", "67%", "-0.98%"],
          ["England", "33%", "+4.44%"]
        ]
      };

      // doc.moveDown().table(table0, 75, 450, { width: 300 });

      // Finalize PDF file
      doc.end();

      await Mail.send("emails.products", data, message => {
        message
          .to(data.user.email)
          .from("info@pluralia.net")
          .subject("Envio da Lista de Produtos Requisitados")
          .attach(
            Helpers.publicPath("attachment/produtosReq" + codeGenerate + ".pdf")
          );
      });
      // Fim do envio

      await ProductRequest.query().delete();

      session.flash({
        notification: "Pedidos enviados com sucesso!",
        alert: "success"
      });

      allProducts = [];

      return response.redirect(
        `/schools/${request.params.id}/logistic/products/request`
      );
    } catch (err) {
      session.flash({
        notification: "Impossivel enviar os pedidos!" + err,
        alert: "error"
      });
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
  async sendOrders({ view, session, request, response }) {
    const school_id = request.params.id;
    const products = [];
    let allProducts = [];
    const ids = request.input("newId");
    let checkeds = Array.isArray(request.input("checked"))
      ? request.input("checked")
      : request.input("checked") === "on"
      ? [request.input("checked")]
      : request.input("checked");
    const quantities = request.input("newQuantity");
    const units = request.input("newUnits");
    const prices = request.input("newPrice");
    let offs = [];
    let ons = [];
    if (Array.isArray(checkeds)) {
      for (let i = 0; i < ids.length; i++) {
        ons.push(i);
      }
    } else {
      session.flash({
        notification: "Selecione os checkboxs de compras!",
        alert: "error"
      });

      return response.redirect("back");
    }

    checkeds = [...ons];
    for (let i = 0; i < offs.length; i++) {
      checkeds.push("off");
    }
    try {
      if (Array.isArray(ons)) {
        for (let i = 0; i < ons.length; i++) {
          let product = await Product.query()
            .where("id", ids[i])
            .where("school_id", school_id)
            .first();

          console.log("teste", product);

          let {
            id,
            name,
            category,
            warehouse,
            quantity,
            price,
            units,
            stockMin,
            unitsMed,
            created_at,
            updated_at
          } = product.toJSON();

          let stock = await Stock.query()
            .where("product_id", id)
            .first();

          let {
            initialStock,
            inputStock,
            outputStock,
            finalStock
          } = stock.toJSON();
          products.push({
            productID: id,
            name,
            category,
            warehouse,
            quantity,
            price,
            units,
            stockMin,
            school_id,
            unitsMed,
            created_at,
            updated_at,
            initialStock,
            inputStock,
            outputStock,
            finalStock
          });
        }
      }

      // Envio de emails
      const data = {
        user: {
          username: "Naldio Pluralia",
          email: "ncjdev@gmail.com",
          password: "devnaldiopluralia"
        },
        products: products
      };

      for (let i = 0; i < products.length; i++) {
        let product = await Product.findBy({ id: products[i].productID });
        allProducts.push([
          product.name,
          quantities[i],
          units[i],
          Number(quantities[i]) > product.stockMin
            ? "Alto"
            : Number(quantities[i]) === product.stockMin
            ? "Médio"
            : "Baixo"
        ]);
      }

      console.log(allProducts);

      var doc = new PDFDocument();
      var stream = doc.pipe(blobStream());
      var codeGenerate = uuid.v4();

      doc.pipe(
        fs.createWriteStream(
          path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "public",
            "attachment",
            "produtosShopping" + codeGenerate + ".pdf"
          )
        )
      );

      doc.image(
        path.join(__dirname, "..", "..", "..", "public", "img", "logo.png"),
        18,
        50,
        { width: 105 }
      );

      // Embed a font, set the font size, and render some text
      doc.fontSize(14).text("Lista de Produtos Requisitados", 50, 120, {
        align: "center"
      });

      const table0 = {
        headers: ["Nome", "Quantidades", "Unidades", "Nível de Stock"],
        rows: allProducts
      };

      doc.table(table0, 75, 150, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(6),
        prepareRow: (row, i) => doc.font("Helvetica").fontSize(6)
      });

      const table1 = {
        headers: ["Country", "Conversion rate", "Trend"],
        rows: [
          ["Switzerland", "12%", "+1.12%"],
          ["France", "67%", "-0.98%"],
          ["England", "33%", "+4.44%"]
        ]
      };

      // doc.moveDown().table(table0, 75, 450, { width: 300 });

      // Finalize PDF file
      doc.end();

      await Mail.send("emails.products", data, message => {
        message
          .to(data.user.email)
          .from("info@pluralia.net")
          .subject("Envio da Lista de Produtos Requisitados")
          .attach(
            Helpers.publicPath(
              "attachment/produtosShopping" + codeGenerate + ".pdf"
            )
          );
      });
      // Fim do envio

      allProducts = [];

      await ProductRequest.query().delete();

      session.flash({
        notification: "Pedidos enviados com sucesso!",
        alert: "success"
      });

      return response.redirect("back");
    } catch (err) {
      session.flash({
        notification: "Impossivel enviar os pedidos!" + err,
        alert: "error"
      });
      return response.redirect("back");
    }
  }
}

module.exports = ProductRequestController;
