const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "daniele",
  database: "questionari",
  port: 5432
});

module.exports = pool;

