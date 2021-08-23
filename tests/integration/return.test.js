const request = require("supertest");
const mongoose = require("mongoose");
const moment = require("moment");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;

  let token;

  const exec = async () => {
    return await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");

    token = new User().generateAuthToken();

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12341",
        phone: "123415125",
      },
      movie: {
        _id: movieId,
        title: "A movie Title",
        dailyRentalRate: 2,
      },
    });
    movie = new Movie({
      _id: movieId,
      title: "A movie Title",
      genre: { name: "213216854" },
      dailyRentalRate: 2,
      numberInStock: 5,
    });
    await movie.save();
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.remove({});
    await Movie.remove({});
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("Should return 400 if customer ID is not provided", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("Should return 400 if movie ID is not provided", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("Should return 404 if no rental matches movie/customer", async () => {
    await Rental.remove({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("Should return 400 if rental is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("Should return 200 if the request is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("Should set the return date if the request is valid", async () => {
    const res = await exec();

    const rentalinDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalinDb.dateReturned;
    expect(diff).toBeLessThan(10);
  });

  it("Should calculate the rental fee (number of days * movie.dailyrentaldate)", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("Should increase the stock of the movie being returned", async () => {
    const res = await exec();

    const movieInDb = await Movie.findById(movieId);

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });
});
