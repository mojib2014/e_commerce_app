const config = require("config");
const { createLogger, transports, format, exceptions } = require("winston");
require("winston-postgresql");
require("express-async-errors");

// Enable exception handling when you create your logger.
const logger = createLogger({
  transports: [
    new transports.File({ filename: "combined.log" }),
    new transports.Console({ format: { colorize: true } }),
  ],
  exceptionsHandlers: [
    new transports.File({ filename: "uncaughtExceptions.log" }),
  ],
});

logger.exceptions.handle(
  new transports.File({ filename: "uncaughtExceptions.log" }),
);

process.on("unhandledRejection", (ex) => {
  throw ex;
});

// winston.add(
//   new transports.PostgreSQL({
//     connString: config.get("db_url"),
//     customSQL: "select custom_logging_function($1, $2, $3)",
//     tableName: "winston_logs",
//     level: "error",
//   }),
// );
