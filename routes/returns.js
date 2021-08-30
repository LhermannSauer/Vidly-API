const express = require("express");
const auth = require("../middleware/auth");
const Joi = require("joi");
const validate = require("../middleware/validate");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");

const router = express.Router();

const validateReturn = (req) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(req);
};

// POST to /api/returns, only for authenticated users
router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental)
    return res.status(404).send("There is no rental for that client/Movie");

  // return bad request if rental has already been processsed
  if (rental.dateReturned)
    return res.status(400).send("The rental has already been processed");

  rental.return();

  // save the rental to db and update the number in stock for the movie
  await rental.save();
  await Movie.findByIdAndUpdate(rental.movie._id, {
    $inc: { numberInStock: 1 },
  });

  return res.send(rental);
});

module.exports = router;
