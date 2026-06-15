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

const app = express();

const authRoutes = require("./routes/authRoutes");
const placeRoutes = require("./routes/placeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const adminReviewRoutes = require("./routes/adminReviewRoutes");
const adminPlaceRoutes = require("./routes/adminPlaceRoutes");
const adminSettingsRoutes = require("./routes/adminSettings.routes");

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());


// Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


// Routes
app.use("/api/auth", authRoutes);

app.use("/api/places", placeRoutes);

app.use("/api/admin", adminReviewRoutes);

app.use("/api/admin", adminPlaceRoutes);

app.use("/api", reviewRoutes);
module.exports=app

const serviceAreaRoutes = require("./routes/serviceAreaRoutes");
const driverProfileRoutes = require("./routes/driverProfile.routes");
// ...
app.use("/api/driver/service-areas", serviceAreaRoutes);
app.use("/api/driver", driverProfileRoutes);

app.use("/api/admin", adminSettingsRoutes);

module.exports = app;
