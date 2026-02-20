const app = require("./app.js");
const { initDB } = require("./config/db.js");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server Running on Port", PORT);
  });
});
