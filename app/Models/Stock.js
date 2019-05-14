"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Stock extends Model {
  schools() {
    return this.belongsTo("App/Model/School");
  }
  products() {
    return this.belongsTo("App/Model/Products");
  }
}

module.exports = Stock;
