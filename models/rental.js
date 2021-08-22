const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema([
  {
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

const Rental = mongoose.model("Rental", rentalSchema);

const validateRental = (rental) => {
  const schema = Joi.object({
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required(),
  });
  return schema.validate(rental);
};

exports.Rental = Rental;
exports.validate = validateRental;
