const mongoose = require("mongoose");
const Joi = require("joi");

// import genre schema for reference
const { genreSchema } = require("./genre");

// create schema for the DB
const movieSchema = new mongoose.Schema([
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
      maxlength: 255,
    },
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, required: true, min: 0, max: 255 },
    dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
  },
]);

const Movie = mongoose.model("Movie", movieSchema);

/**
 * Validate with Joi a movie object
 * @param {object} movie a Movei object, require title, genreId, numberinStock and daily rental rate
 * @returns {boolean}
 */
const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(5).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().integer().min(1).required(),
    dailyRentalRate: Joi.number().min(1).required(),
  });
  return schema.validate(movie);
};

exports.Movie = Movie;
exports.validateMovies = validateMovie;
exports.movieSchema = movieSchema;
