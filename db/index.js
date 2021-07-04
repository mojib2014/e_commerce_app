("user strict");
const config = require("config");
const { Pool } = require("pg");

const pool = new Pool({
  user: config.get("db.dbUser"),
  password: config.get("db.dbPassword"),
  database: config.get("db.dbDatabase"),
  host: config.get("db.dbHost"),
  port: config.get("db.dbPort"),
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
