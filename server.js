require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB()
  .then(() => {
    app.listen(5000, () => {
      console.log(`Server is successfully listening on port 5000...`);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err.message);
  });
