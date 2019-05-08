"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Avatar extends Model {
  school() {
    return this.belongsTo("App/Models/School");
  }
}

module.exports = Avatar;
