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

// 1. Middleware (يجب أن يكون قبل أي راوتر)
app.use(cors());
app.use(express.json());        // ← محلل JSON أساسي
app.use(cookieParser());

// 2. استيراد الراوترات
const authRoutes = require("./routes/authRoutes");
const placeRoutes = require("./routes/placeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const adminReviewRoutes = require("./routes/adminReviewRoutes");

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/places', placeRoutes)
app.use("/api/admin", adminReviewRoutes);
module.exports=app

app.use("/api", reviewRoutes);   // ← مرّة واحدة وبعد body parser

