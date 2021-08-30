const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validateUser } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");

// endpoind for registering users and accessing the account screen

router.get("/me", [auth, validate(validateUser)], async (req, res) => {
  // return
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

// POST to /api/users to  Register user
router.post("/", validate(validateUser), async (req, res) => {
  // check that email do not have an account
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  // create a user object picking the necessary parameters from the form
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  // use bcrypt to save the hashed password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // generate token and return it in the header of the response.
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
