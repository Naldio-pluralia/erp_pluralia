"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Product extends Model {
  school() {
    return this.belongsTo("App/Model/School");
  }
  stock() {
    return this.belongsTo("App/Model/Stock");
  }
}

module.exports = Product;
