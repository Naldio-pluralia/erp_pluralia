"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class School extends Model {
  products() {
    return this.hasMany("App/Model/Product");
  }
  hasMany() {
    return this.hasMany("App/Model/Stock");
  }
  avatar() {
    return this.hasOne("App/Model/Avatar");
  }
}

module.exports = School;
