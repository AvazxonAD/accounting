"use strict";

var _require = require("pg"),
  Pool = _require.Pool;
var pool = new Pool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
module.exports = pool;