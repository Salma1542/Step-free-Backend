const dotenv = require("dotenv");
dotenv.config();


const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});