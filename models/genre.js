const mongoose = require("mongoose");
const Joi = require("joi");

// simple schema for DB
const genreSchema = new mongoose.Schema([
  { name: { type: String, required: true, minlength: 5, maxlength: 50 } },
]);

// create model for DB
const Genre = mongoose.model("Genre", genreSchema);

/**
 * Validates the input for the genre model
 * @param {genre} genre A Genre object. Requires a name parameter
 * @returns {boolean}
 */
const validateGenre = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(genre);
};

exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.genreSchema = genreSchema;
