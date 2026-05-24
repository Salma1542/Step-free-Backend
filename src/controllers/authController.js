const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const generateToken = require('../utils/generateToken');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      city,
      phone,
      gender,
      dateOfBirth,
      role,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not match",
      });
    }

    const allowedRoles = ["user", "driver", "placeOwner"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Role",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      password,
      city,
      phone,
      gender,
      dateOfBirth,
      role: role || "user",
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    await user.save(); 

    await sendEmail({
      email: user.email,
      subject: "Your OTP Code - Step Free",
      message: `Your OTP is: ${otp}. Valid for 10 minutes.`,
    });

    return res.status(201).json({
      success: true,
      message: "OTP sent to email",
      token: generateToken(user._id, user.role),
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    return res.status(200).json({
      success: true,
      token: generateToken(user._id, user.role),
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail({
      email: user.email,
      subject: "New OTP Code - Step Free",
      message: `Your new OTP is: ${otp}.`,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword=async (req,res)=>{
    try{
        const{email}=req.body
        const user=await User.findOne({email})
            if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
const otp=generateOTP()
user.resetPasswordOtp=otp
user.resetPasswordOtpExpire=Date.now()+10*60*1000
await user.save()

await sendEmail({
      email: user.email,
      subject: " Reset Password OTP - Step Free",
      message: otp,
    });
     res.status(200).json({
      success: true,
      message: "Reset OTP sent to email",
    });
    }catch(error)
    {
   res.status(500).json({
      success: false,
      message: error.message,
    });
    }
}


const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.resetPasswordOtpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.password = newPassword;

    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  register,
  login,
  getMe,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
};