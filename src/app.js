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
const serviceAreaRoutes = require("./routes/serviceAreaRoutes");
const driverProfileRoutes = require("./routes/driverProfile.routes");

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

// Driver routes
app.use("/api/driver/service-areas", serviceAreaRoutes);
app.use("/api/driver", driverProfileRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Step Free Backend is running" });
});

module.exports = app;
