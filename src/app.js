const express=require("express")
const cors=require("cors")
const cookieParser=require("cookie-parser")
const app=express()
const authRoutes = require('./routes/authRoutes');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//Routes

app.use('/api/auth',authRoutes)
module.exports=app