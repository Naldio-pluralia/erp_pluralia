"use strict";

const School = use("App/Models/School");
const Avatar = use("App/Models/Avatar");

class SchoolController {
  async index({ view }) {
    const schools = await School.all();
    console.log(schools);
    return view.render("school.index", { schools: schools.toJSON() });
  }
  async create({ view }) {
    return view.render("school.new");
  }
  async store({ view, request, response }) {
    const data = request.except(["_csrf", "avatar"]);
    const avatarData = request.only("avatar");

    const school = await School.create(data);

    // const avatar = new Avatar();
    // avatar.title = avatarData;
    // avatar.path = avatarData;

    // const newAvatar = await school.avatar().save(avatar);
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
