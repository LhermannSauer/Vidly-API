/**
 * A middleware for validating the body of a request for posting/updating data in the DB.
 * @param {function} validator A validator function for a model
 *
 */
module.exports = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next();
  };
};
