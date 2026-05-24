const express=require('express')
const router=express.Router()
const{register, getMe,verifyOTP,  resendOTP, forgotPassword, resetPassword,}=require('../controllers/authController')
const {login}=require('../controllers/authController')
const protect=require('../middleware/authMiddleware')
const authorize = require("../middleware/authorize");
router.post('/register',register)
router.post('/login',login)
router.get('/me',protect,getMe)
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports=router