const fs = require("fs");
const path = require("path");
const db = require("./db");

const initDb = async () => {
  try {
    const sqlPath = path.join(__dirname, "..", "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Checking database schema...");
    await db.query(sql);
    console.log("Database Connected");
  } catch (error) {
    console.log("Database Not Connected");
  }
};
