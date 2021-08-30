const config = require("config");

/**
 * config function that asserts the variable jwtPrivateKey,
 * required for authorization, is defined, otherwise it throws an error
 *
 */
module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR! jwtPrivateKey is not defined.");
  }
};
