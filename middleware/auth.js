const jwt = require("jsonwebtoken");
const config = require("config");

/**
 * A middleware function that throws unauthorized for not logged in users
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
module.exports = function (req, res, next) {
  // take the token from the header, if none provided throw 401
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  // verify the token with the private key in the env variables, throw 400 if invalid
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
