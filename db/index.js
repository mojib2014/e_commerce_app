("user strict");
const config = require("config");
const { Pool } = require("pg");

const devUrl = { connectionString: config.get("db_url") };
const proUrl = { connectionString: process.env.DATABASE_URL };

const pool = new Pool(process.env.NODE_ENV === "production" ? proUrl : devUrl);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
