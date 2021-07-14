const config = require("config");
const { ExceptionHandler } = require("winston");
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
    new winston.transports.Console({ format: winston.format.simple() }),
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(
    new winston.transports.Console({ format: winston.format.simple() }),
  );
  winston.add(new winston.transports.File({ filename: "logfile.log" }));

  winston.add(
    new winston.transports.PostgreSQL({
      connString: config.get("db"),
      customSQL: "select custom_logging_function($1, $2, $3)",
      tableName: "winston_logs",
      level: "info",
    }),
  );
};
