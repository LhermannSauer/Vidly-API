const { Customer, validateCustomer } = require("../models/customer");
const validate = require("../middleware/validate");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// GET /api/customers get a list of customers sorted by name
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

// POST to /api/customer
router.post("/", validate(validateCustomer), async (req, res) => {
  // create an instance of customer with the body of the request, already validated.
  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  // save customer in DB
  customer = await customer.save();
  // return the customer in DB
  res.send(customer);
});

// update a specific customer using the id
router.put("/:id", validate(validateCustomer), async (req, res) => {
  // Other option is first using findById and then updating and saving the updated object
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    },
    // use the new option in order to return the new object in the response
    { new: true }
  );

  // if no customer is found, throw 404
  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  // if found, return the new customer object to the client
  res.send(customer);
});

// DELETE /api/customer/id
router.delete("/:id", async (req, res) => {
  // Could also use first findById and then remove
  const customer = await Customer.findByIdAndRemove(req.params.id);

  // if not found, return 404
  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  // if deleted, return the deleted item
  res.send(customer);
});

// GET to /api/customer/id
router.get("/:id", async (req, res) => {
  // get the customer with the ID in parameters of request, if not found, return 404
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

module.exports = router;
