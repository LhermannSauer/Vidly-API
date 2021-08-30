const mongoose = require("mongoose");
const moment = require("moment");

// Create schema for DB
const rentalSchema = new mongoose.Schema([
  {
    // could be replaced by customerSchema
    customer: {
      type: new mongoose.Schema({
        name: { type: String, required: true, minlength: 5, maxLength: 50 },
        isGold: { type: Boolean, default: false },
        phone: { type: String, required: true, minlength: 5, maxLength: 50 },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      default: Date.now,
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxLength: 50,
        },
        dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
      }),

      required: true,
    },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0 },
  },
]);

// create an additional method for the schema in order to check if a rental for a
// particular customer and movie exists
rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
};

/**
 * Calculate the rental fee and add it to the rental record, based on the days
 * between the rental and the return
 */
rentalSchema.methods.return = function () {
  // add the date returned when the function is called
  this.dateReturned = Date.now();

  // calculate the difference between the dates and the rental fee
  const rentalDays = moment().diff(this.dateOut, "days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

// create model in the db
const Rental = mongoose.model("Rental", rentalSchema);

// Validation with JOI for requests
const validateRental = (rental) => {
  const schema = Joi.object({
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required(),
  });
  return schema.validate(rental);
};

exports.Rental = Rental;
exports.validateRental = validateRental;
