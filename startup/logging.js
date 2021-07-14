const winston = require("winston");
require("winston-postgresql");
require("express-async-errors");

// Enable exception handling when you create your logger.
module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.File({
      filename: "uncaughtExceptions.log",
      handleExceptions: true,
    }),
  );

  winston.add(
    new winston.transports.Console({
      format: winston.format.prettyPrint({ colorize: true }),
    }),
  );

  winston.add(new winston.transports.File({ filename: "logfile.log" }));

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(
    new winston.transports.PostgreSQL({
      connString: "postgres://mojib2014:5432@localhost:5432/mojib2014",
      customSQL: "select custom_logging_function($1, $2, $3)",
      tableName: "winston_logs",
      level: "error",
    }),
  );
};
