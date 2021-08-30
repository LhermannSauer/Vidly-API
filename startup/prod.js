const helmet = require("helmet");
const compression = require("compression");

/**
 * Load additional libraries for production, not required for development
 * @param {any} app the express app
 */
module.exports = function (app) {
  app.use(helmet());
  app.use(compression());
};
