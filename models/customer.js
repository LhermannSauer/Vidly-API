const mongoose = require("mongoose");
const Joi = require("joi");

// Define schema for DB
const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, defualt: false },
  name: { type: String, required: true, minlength: 5, maxlength: 20 },
  phone: { type: String, required: true, match: /^\d{4,9}$/ },
});

// create a model for the DB, using the schema
const Customer = mongoose.model("Customer", customerSchema);

/**
 * A function that validates the input for the customer object
 * @param {Object} customer A customer object, requires name, isGold and phone
 * @returns boolean
 */
const validateCustomer = (customer) => {
  const schema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().min(5).max(20).required(),
    phone: Joi.string()
      .min(9)
      .max(12)
      .regex(/^\d{4,9}$/),
  });
  return schema.validate(customer);
};

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
exports.customerSchema = customerSchema;
