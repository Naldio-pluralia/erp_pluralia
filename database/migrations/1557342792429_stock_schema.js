"use strict";

const Schema = use("Schema");

class StockSchema extends Schema {
  up() {
    this.create("stocks", table => {
      table.increments();
      table.integer("initialStock");
      table.integer("inputStock");
      table.integer("outputStock");
      table.integer("finalStock");

      table
        .integer("product_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("products")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table
        .integer("school_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("schools")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table.timestamps();
    });
  }

  down() {
    this.drop("stocks");
  }
}

module.exports = StockSchema;
