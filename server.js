const app=require("./src/app")
const dotenv = require('dotenv');
const connectDB = require("./src/config/db");
dotenv.config();
connectDB()
const PORT=process.env.PORT||5000

const server=app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
    
})