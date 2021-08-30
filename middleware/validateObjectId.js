const mongoose = require("mongoose");

/**
 * a Middleware function that validates the ID of the request
 * @param {object} req the request object
 * @param {object} res a response to send to the server
 * @param {function} next a call to the next middleware function
 * @returns void || 404
 */
module.exports = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Invalid ID.");

  next();
};
