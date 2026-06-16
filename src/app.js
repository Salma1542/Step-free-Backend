// const express=require("express")
// const cors=require("cors")
// const cookieParser=require("cookie-parser")
// const app=express()
// const authRoutes = require('./routes/authRoutes');
// const placeRoutes = require('./routes/placeRoutes');
// const swaggerUi = require("swagger-ui-express");
// const swaggerSpec = require("./config/swagger");
// app.use("/api", require("./routes/reviewRoutes"));


// app.use(cors())
// app.use(express.json())
// app.use(cookieParser())

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Routes
// app.use('/api/auth', authRoutes)
// app.use('/api/places', placeRoutes)
// app.use("/api", require("./routes/reviewRoutes"));

// module.exports=app

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

const authRoutes = require("./routes/authRoutes");
const placeRoutes = require("./routes/placeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const adminReviewRoutes = require("./routes/adminReviewRoutes");
const adminPlaceRoutes = require("./routes/adminPlaceRoutes");
const adminSettingsRoutes = require("./routes/adminSettings.routes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminAnalyticsRoutes = require("./routes/analyticsRoutes");

const serviceAreaRoutes = require("./routes/serviceAreaRoutes");
const driverProfileRoutes = require("./routes/driverProfile.routes");

app.use(
 cors({
 origin: true,
 credentials: true,
 })
);

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api", reviewRoutes);

app.use("/api/admin", adminReviewRoutes);
app.use("/api/admin", adminPlaceRoutes);
app.use("/api/admin", adminSettingsRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin", adminAnalyticsRoutes);

app.use("/api", reviewRoutes);
app.use("/api/driver-reviews", driverReviewRoutes);

const serviceAreaRoutes = require("./routes/serviceAreaRoutes");
// ...
app.use("/api/driver/service-areas", serviceAreaRoutes);
app.use("/api/drivers", driverProfileRoutes);

module.exports = app;