const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

/**
 * Connect the app to the db defined in the environment variables.
 */
module.exports = function () {
  mongoose.connect(config.get("db"));
};
