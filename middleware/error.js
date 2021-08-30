const winston = require("winston");

/**
 * A middleware function that catches all unexpected errors and log them
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = function (err, req, res, next) {
  winston.error(err.message, err);

  res.status(500).send("Something failed.");
};
