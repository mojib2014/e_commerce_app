"user strict";
const { Pool } = require("pg");
const { DB } = require("../config");

const pool = new Pool({
  user: DB.PGUSER,
  password: DB.PGPASSWORD,
  database: DB.PGDATABASE,
  host: DB.PGHOST,
  port: DB.PGPORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
