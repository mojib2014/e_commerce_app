("user strict");
const config = require("config");
const { Pool } = require("pg");

const devConfig = {
  user: config.get("db.dbUser"),
  password: config.get("db.dbPassword"),
  database: config.get("db.dbDatabase"),
  host: config.get("db.dbHost"),
  port: config.get("db.dbPort"),
};

const proConfig = {
  connectionString: process.env.DATABASE_URL, // heroku addon
};

const pool = new Pool(
  process.env.NODE_ENV === "production" ? proConfig : devConfig,
);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
