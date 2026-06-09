const express=require("express")
const cors=require("cors")
const cookieParser=require("cookie-parser")
const app=express()
const authRoutes = require('./routes/authRoutes');
const placeRoutes = require('./routes/placeRoutes');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
app.use("/api", require("./routes/reviewRoutes"));


app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/places', placeRoutes)
app.use("/api", require("./routes/reviewRoutes"));

module.exports=app