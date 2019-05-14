"use strict";

const Stock = use("App/Models/Stock");
const Product = use("App/Models/Product");

class DownloadController {
  async getProducts({ response, params }) {
    const fs = require("fs");
    const PDFDocument = require("../../Helpers/PDFDocumentWithTables");
    const blobStream = require("blob-stream");
    const path = require("path");

    const all = await Stock.query()
      .where("school_id", params.id)
      .fetch();

    const allProducts = [];

    for (let i = 0; i < all.toJSON().length; i++) {
      let product = await Product.findBy({ id: all.toJSON()[i].product_id });
      allProducts.push([
        product.name,
        this.capitalize(product.warehouse),
        this.capitalize(product.category),
        product.quantity,
        product.units,
        all.toJSON()[i].initialStock,
        all.toJSON()[i].inputStock,
        all.toJSON()[i].outputStock,
        all.toJSON()[i].finalStock
      ]);
    }

    var doc = new PDFDocument();
    var stream = doc.pipe(blobStream());

    doc.pipe(
      fs.createWriteStream(
        path.resolve(
          __dirname,
          "..",
          "..",
          "..",
          "public",
          "downloads",
          "produtos.pdf"
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
    doc.fontSize(14).text("Lista de Produtos", 50, 120, {
      align: "center"
    });

    const table0 = {
      headers: [
        "Nome",
        "Armazem",
        "Categoria",
        "Quantidade",
        "Unidades",
        "Stock Inicial",
        "Entrada",
        "Saída",
        "Stock Final"
      ],
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
    return response.redirect("/downloads/produtos.pdf");
  }

  convertToMoney(money) {
    return money + ".00 KZ";
  }
  capitalize(string) {
    let str = `${string}`;
    return str.charAt(0).toUpperCase() + string.slice(1);
  }
}

module.exports = DownloadController;
