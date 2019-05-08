"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class OrdersSchema extends Schema {
  up() {
    this.create("orders", table => {
      table.increments();
      table.string("name").notNullable();
      table.string("category");
      table.string("warehouse");
      table.integer("quantity");
      table.decimal("price", 10, 2);
      table.integer("units");
      table.integer("stockMin");
      table.string("unitsMed");
      table.integer("stockLevel");

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
    this.drop("orders");
  }
}

module.exports = OrdersSchema;
