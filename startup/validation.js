const Joi = require("joi");

/**
 * Load the defined validation library
 */
module.exports = function () {
  Joi.objectId = require("joi-objectid")(Joi);
};
