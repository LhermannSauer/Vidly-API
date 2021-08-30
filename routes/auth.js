const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const validate = require("../middleware/validate");
const router = express.Router();

/**
 * Validates the arguments passed on the auth request
 * @param {Object} req The request object. Should include email and password in its body
 * @returns boolean
 */
const validateAuth = (req) => {
  // define the Joi schema and validate it
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
};

// route /api/auth used to POST the login request in order to get the user information
router.post("/", validate(validateAuth), async (req, res) => {
  // first check if the email exists in db, otherwise throw generic error
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  // validate the password with bcrypt, comparing the stored in the db (hashed) with the one provided
  // if incorrect, use generic error
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  // here mail and password are OK, generate a token and send back to the client
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
