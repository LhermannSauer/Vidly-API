const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");

Fawn.init(mongoose);

// GET /api/rentals => array of rentals sorted by its date
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

// POST to /api/rentals, validated through middleware
router.post("/", validate(validateRental), async (req, res) => {
  // check that customer existst, return bad request if not.
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  // check that movie exists, otherwise return bad request.
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  //if no movies in stock, return bad request.
  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  // create a rental object with movie and customer information
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  // use FAWN to both save the rental object and decrease the number in stock
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          // use #inc for modifying numberical values
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.send(rental);
    // if task throws error, return 500
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
});

// GET api/rentals/id
router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

module.exports = router;
