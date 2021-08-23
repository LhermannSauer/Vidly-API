const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const validate = require("../middleware/validate");
const router = express.Router();

const validateAuth = (req) => {
  const schema = {
    email: Joi.email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  };
  console.log("validateAuth");
  return schema.validate(req);
};

router.post("/", validate(validateAuth), async (req, res) => {
  console.log("AUTH TRIGGERED");
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
