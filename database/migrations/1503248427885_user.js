"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", table => {
      table.increments();
      table
        .string("username", 80)
        .notNullable()
        .unique();
      table
        .string("email", 254)
        .notNullable()
        .unique();

      table.string("charge", 254).notNullable();
      table.string("department", 254).notNullable();

      table.string("password", 60).notNullable();
      table.boolean("is_admin").defaultTo(false);
      table.boolean("is_user").defaultTo(true);
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
