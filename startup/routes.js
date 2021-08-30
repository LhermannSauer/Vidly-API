const express = require("express");
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const returns = require("../routes/returns");
const users = require("../routes/users");
const auth = require("../routes/auth");
const customers = require("../routes/customers");
const home = require("../routes/home");
const error = require("../middleware/error");

/**
 * Load the routes of the application
 * @param {any} app The express app
 */
module.exports = function (app) {
  app.use(express.json());

  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use("/", home);

  app.use(error);
};
