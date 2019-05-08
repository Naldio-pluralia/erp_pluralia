"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SchoolSchema extends Schema {
  up() {
    this.create("schools", table => {
      table.increments();
      table.string("number");
      table.string("name").notNullable();
      table.string("address");
      table.string("email");
      table.string("email2");
      table.string("cellphone1");
      table.string("cellphone2");
      table.timestamps();
    });
  }

  down() {
    this.drop("schools");
  }
}

module.exports = SchoolSchema;
