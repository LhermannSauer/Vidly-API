const express = require("express");
const winston = require("winston");

const app = express();
app.set("view engine", "pug");

require("./startup/validation")();
require("./startup/logging")();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
