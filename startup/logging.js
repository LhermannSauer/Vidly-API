const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" })
  );
  winston.exceptions.handle(
    new winston.transports.File({ filename: "exceptions.log" }),
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );

  // throw ex on unhandled rejection to trigger winston
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
