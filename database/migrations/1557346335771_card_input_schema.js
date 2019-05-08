"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CardInputSchema extends Schema {
  up() {
    this.create("card_inputs", table => {
      table.increments();
      table.string("name");
      table.string("warehouse");
      table.string("category");
      table.string("quantity");
      table.string("units");
      table
        .integer("product_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("products")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamps();
    });
  }

  down() {
    this.drop("card_inputs");
  }
}

module.exports = CardInputSchema;
