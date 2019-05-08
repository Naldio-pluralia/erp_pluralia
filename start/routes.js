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
Route.get("/login", ({ view }) => view.render("login"));
Route.get("/dashboard", ({ view }) => view.render("school.dashboard"));

Route.get("/schools", "SchoolController.index");
Route.post("/schools", "SchoolController.store");
Route.get("/schools/register", "SchoolController.create");

Route.get("/schools/:id", "SchoolController.show");
Route.get("/schools/:id/logistic/products", "LogisticController.index");
Route.post("/schools/:id/logistic/products", "ProductController.store");
Route.get(
  "/schools/:id/logistic/products/register",
  "LogisticController.create"
);
Route.get(
  "/schools/:id/logistic/products/request",
  "LogisticController.requestProduct"
);
Route.post(
  "/schools/:id/stock/product/addRequest",
  "ProductRequestController.addRequest"
);
Route.post(
  "/school/:id/stock/product/sendRequest",
  "ProductRequestController.sendRequest"
);
Route.get(
  "/school/:schoolId/stock/product/:productId/removeRequest",
  "ProductRequestController.removeRequest"
);
Route.get(
  "/school/:schoolId/stock/product/:productId/removeStock",
  "StockController.removeStock"
);

Route.get(
  "/schools/:id/logistic/products/orders",
  "LogisticController.orderProduct"
);
Route.get("/schools/:id/logistic/products/add", "LogisticController.add");
Route.get("/schools/:id/logistic/products/remove", "LogisticController.remove");
Route.post("/schools/:id/stock/product/addStock", "StockController.addStock");
