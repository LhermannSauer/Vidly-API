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

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental)
    return res.status(404).send("There is no rental for that client/Movie");

  if (rental.dateReturned)
    return res.status(400).send("The rental has already been processed");

  rental.return();

  await rental.save();

  await Movie.findByIdAndUpdate(rental.movie._id, {
    $inc: { numberInStock: 1 },
  });

  return res.send(rental);
});

module.exports = router;
function returnMovie(rental) {}
