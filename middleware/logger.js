function log(req, res, next) {
  //next is the next middleware in the pipeline
  console.log("Logging..."); // do whatever you want with the request
  next(); // pass control to the next middleware
}

module.exports = log;
