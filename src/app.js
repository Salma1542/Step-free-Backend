const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const authRoutes = require("./routes/authRoutes");
const placeRoutes = require("./routes/placeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const adminReviewRoutes = require("./routes/adminReviewRoutes");
const adminPlaceRoutes = require("./routes/adminPlaceRoutes");
const adminSettingsRoutes = require("./routes/adminSettings.routes");

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", reviewRoutes);

app.use("/api/admin", adminSettingsRoutes);

module.exports = app;
