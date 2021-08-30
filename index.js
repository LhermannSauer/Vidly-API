const express = require("express");
const winston = require("winston");

const app = express();

// Set the view engine to pug, just for the index page.
app.set("view engine", "pug");

// Require the startup folder, and call the import as files export functions.
require("./startup/validation")();
require("./startup/logging")();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/prod")(app);

// load port of environment variables (if exists) and start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
