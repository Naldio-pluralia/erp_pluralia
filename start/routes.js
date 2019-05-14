"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.on("/").render("login");
Route.get("/login", ({ response, view, auth }) => {
  if (auth.user) {
    response.redirect("/schools");
  } else {
    view.render("login");
  }
});
Route.post("/login", "UserController.login").as("login");

Route.group(() => {
  // Usuarios
  Route.get("/register", ({ view }) => view.render("register"));
  Route.get("/logout", "UserController.logout");

  // Dashboard Escolas
  Route.get("/dashboard", ({ view }) => view.render("school.dashboard"));

  // Escolas
  Route.get("/schools", "SchoolController.index");
  Route.get("/schools/register", "SchoolController.create");
  Route.post("/schools/register", "SchoolController.store").as(
    "schools.register"
  );
  Route.get("/schools/:id", "SchoolController.show");

  // Produtos
  Route.get("/schools/:id/logistic/products", "LogisticController.index");
  Route.get(
    "/schools/:id/logistic/products/register",
    "LogisticController.create"
  );
  Route.post("/schools/:id/logistic/products", "ProductController.store");

  Route.get(
    "/schools/:id/logistic/products/request",
    "LogisticController.requestProduct"
  );
  Route.post(
    "/schools/:id/stock/product/addRequest",
    "ProductRequestController.addRequest"
  );
  Route.get(
    "/schools/:id/logistic/products/download",
    "DownloadController.getProducts"
  );
  Route.get(
    "/schools/:schoolId/logistic/products/:productId/details",
    "ProductController.showProduct"
  );

  // Stock
  Route.get("/schools/:id/logistic/products/add", "LogisticController.add");
  Route.get(
    "/schools/:id/logistic/products/remove",
    "LogisticController.remove"
  );
  Route.post("/schools/:id/stock/product/addStock", "StockController.addStock");
  Route.post(
    "/schools/:id/stock/product/addInStock",
    "StockController.addInStock"
  );
  Route.post(
    "/schools/:id/stock/product/remInStock",
    "StockController.remInStock"
  );
  Route.post("/schools/:id/stock/product/remStock", "StockController.remStock");

  // Requisição
  Route.get(
    "/schools/:id/logistic/products/request",
    "LogisticController.requestProduct"
  );
  Route.post(
    "/schools/:id/stock/product/addRequest",
    "ProductRequestController.addRequest"
  );
  Route.get(
    "/school/:schoolId/stock/product/:productId/removeRequest",
    "ProductRequestController.removeRequest"
  );
  Route.post(
    "/school/:id/stock/product/sendRequest",
    "ProductRequestController.sendRequest"
  );
  Route.get(
    "/school/:schoolId/stock/product/:productId/removeStock",
    "StockController.removeStock"
  );

  // Compras
  Route.get(
    "/schools/:id/logistic/products/orders",
    "LogisticController.orderProduct"
  );
  Route.post(
    "/school/:id/stock/product/sendOrders",
    "ProductRequestController.sendOrders"
  );
  Route.post(
    "/school/:id/stock/product/clearShopping",
    "LogisticController.clearShopping"
  );
  Route.get(
    "/school/:schoolId/stock/product/:productId/removeItemStock",
    "StockController.removeItemStock"
  );
}).middleware(["auth"]);
