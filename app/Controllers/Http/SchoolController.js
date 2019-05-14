"use strict";

const School = use("App/Models/School");
const Avatar = use("App/Models/Avatar");
const Helpers = require("path");  
const path = require("path");
const uuid = require("uuid");

class SchoolController {
  async index({ view }) {
    const schools = await School.all();
    return view.render("school.index", { schools: schools.toJSON() });
  }
  async create({ view }) {
    return view.render("school.new");
  }
  async store({ view, request, response }) {
    const data = request.except(["_csrf", "avatar"]);

    const school = await School.create(data);

    const profilePic = request.file("avatar", {
      types: ["image"],
      size: "2mb"
    });

    await profilePic.move(
      path.resolve(__dirname, "..", "..", "..", "public", "uploads"),
      {
        name: `Logotipo-${uuid.v4()}`,
        overwrite: true
      }
    );

    if (!profilePic.moved()) {
      console.log("Parrou errp Moved");
      return profilePic.error();
    }

    console.log();

    const avatar = new Avatar();
    avatar.title = `${profilePic.toJSON().clientName}`;
    avatar.path = `${profilePic.toJSON().fileName}.${
      profilePic.toJSON().subtype
    }`;

    const newAvatar = await school.avatar().save(avatar);
    console.log("Avatar Salvou");
    return response.redirect("/schools");
  }
  async show({ request, view, session }) {
    if (session.get("id") === request.params.id) {
      return view.render("school.dashboard", { id: session.get("id") });
    } else {
      session.put("id", request.params.id);
      return view.render("school.dashboard", { id: request.params.id });
    }
  }
}

module.exports = SchoolController;
