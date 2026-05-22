const express=require("express")
const cors=require("cors")
const cookieParser=require("cookie-parser")
const app=express()
const authRoutes = require('./routes/authRoutes');

app.use(cors())
app.use(express.json())
app.use(cookieParser())

//Routes

app.use('/api/auth',authRoutes)
module.exports=app