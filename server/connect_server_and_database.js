const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "1318",
  host: "localhost",
  port: 5432,
  database: "store",
});

module.exports = pool;
