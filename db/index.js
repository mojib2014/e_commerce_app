("user strict");
const config = require("config");
const { Pool } = require("pg");

const devUrl = {
  connectionString: config.get("dbUrl"),
  // ssl: {
  //   rejectUnauthorized: false,
  // },
};
const proUrl = { connectionString: process.env.DATABASE_URL };

const pool = new Pool(process.env.NODE_ENV === "production" ? proUrl : devUrl);

pool.on("error", (err) =>
  console.log(`db connection error: ${err} and ${error.stack}`),
);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
