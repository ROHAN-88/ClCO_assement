const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const initDB = async () => {
  try {
    const sqlPath = path.join(__dirname, "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");
    await pool.query(sql);
    console.log("Database Initialize Successfully");
  } catch (error) {
    console.error("Error Initializing Database", error);
  }
};

module.exports = { pool, initDB };
