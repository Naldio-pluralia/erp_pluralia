"use strict";
const { validateAll } = use("Validator");
const User = use("App/Models/User");
const Hash = use("Hash");

class UserController {
  async store({ request, session, response }) {
    const rules = {
      username: "required",
      email: "required|email|unique:users,email",
      password: "required|confirmed",
      charge: "required",
      department: "required"
    };

    const validation = await validateAll(request.all(), rules);

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashExcept(["password"]);

      return response.redirect("back");
    }

    const {
      username,
      email,
      password,
      password_confirmation,
      charge,
      department
    } = request.all();

    if (password_confirmation !== password) {
      session.flash({
        notification: {
          type: "error",
          message: "Password é diferende da confirmação"
        }
      });

      return response.redirect("back");
    }

    await User.create({
      username,
      email,
      password,
      charge,
      department
    });

    return response.redirect("/schools");
  }

  async login({ request, auth, session, response }) {
    // get form data
    const { email, password, remember } = request.all();

    // retrieve user base on the form data
    const user = await User.query()
      .where("email", email)
      .where("is_user", true)
      .first();

    // Verify password
    if (user) {
      const passwordVerified = await Hash.verify(password, user.password);

      console.log("Chegou", passwordVerified);

      if (passwordVerified) {
        // Login user
        await auth.remember(!!remember).login(user);

        session.flash({
          notification: {
            type: "success",
            message: `Bem-vindo ${user.username}.`
          }
        });

        return response.route("/schools");
      }
    }

    session.flash({
      notification: {
        type: "error",
        message: `Não foi possível confirmar suas credenciais. Confirme se você confirmou seu endereço de e-mail.`
      }
    });

    return response.redirect("back");
  }

  async logout({ auth, response, session }) {
    await auth.logout();

    session.flash({
      notification: {
        type: "success",
        message: `Conta terminada com successo!.`
      }
    });

    return response.redirect("/");
  }
}

module.exports = UserController;
