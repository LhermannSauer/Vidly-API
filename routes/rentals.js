const Fawn = require("fawn");
const mongoose = require("mongoose");

const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut client");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // look for the movie in the genre table
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid Movie ID");

  // look for the customer in the genre table
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer ID");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie out of stock");

  // format input to schema
  let rental = new Rental({
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    daysRented: req.body.daysRented,
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
  } catch (e) {
    res.status(500).send("Something failed...");
  }

  res.send(rental);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid Movie ID");

  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      date: req.body.date,
      movie: { _id: movie._id, title: movie.title },
      daysRented: req.body.daysRented,
    },
    { new: true }
  );

  if (!rental)
    return res
      .status(404)
      .send("The Rental with the id indicate was not found");

  res.send(rental);
});

router.delete("/:id", async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);

  if (!rental)
    return res
      .status(404)
      .send("The movie with the id indicated was not found");

  res.send(rental);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The movie with the id indicate was not found");

  res.send(rental);
});

module.exports = router;
