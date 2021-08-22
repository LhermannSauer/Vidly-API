const { Customer, validate } = require("../models/customer");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const customer = await Customer.find().sort("name");
  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details);

  const customer = new Customer({
    //...req.body,
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  await customer.save();

  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!customer)
    return res
      .status(404)
      .send("The client with the id indicate was not found");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The client with the id indicated was not found");

  res.send(customer);
});

router.get("/:id", (req, res) => {
  const customer = Customer.findById(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The genre with the id indicated was not found");

  res.send(customer);
});

module.exports = router;
