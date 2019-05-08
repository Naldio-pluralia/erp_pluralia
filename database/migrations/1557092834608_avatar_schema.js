"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AvatarSchema extends Schema {
  up() {
    this.create("avatars", table => {
      table.increments();
      table.string("title");
      table.string("path");

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
    this.drop("avatars");
  }
}

module.exports = AvatarSchema;
