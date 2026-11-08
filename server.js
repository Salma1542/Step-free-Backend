
const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    try {
      await connectDB();
      return app(req, res);
    } catch (error) {
      console.error("Database connection failed:", error.message);
      return res.status(500).json({
        message: "Database connection failed",
      });
    }
  };
} else {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`server running on ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Database connection failed:", error.message);
      process.exit(1);
    });
}
