const User = require("../models/User");

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// CREATE NEW USER
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, isBlocked } = req.body;

    // Validation
    if (!firstName || !email) {
      return res.status(400).json({
        success: false,
        message: "firstName and email are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user
    const user = new User({
      firstName: firstName.trim(),
      lastName: (lastName || "").trim(),
      email: email.toLowerCase(),
      role: (role || "user").toLowerCase(),
      isBlocked: isBlocked || false,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE USER (All fields)
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, isBlocked } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate required fields
    if (firstName !== undefined) {
      if (!firstName.trim()) {
        return res.status(400).json({
          success: false,
          message: "First name cannot be empty",
        });
      }
      user.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      user.lastName = lastName.trim();
    }
    
    if (email !== undefined) {
      const emailLower = email.toLowerCase();
      // Check if email already taken
      const existingUser = await User.findOne({ 
        email: emailLower, 
        _id: { $ne: req.params.id } 
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already taken",
        });
      }
      user.email = emailLower;
    }
    
    if (role !== undefined) {
      const validRoles = ["user", "admin", "driver", "placeowner"];
      const roleLower = role.toLowerCase();
      if (!validRoles.includes(roleLower)) {
        return res.status(400).json({
          success: false,
          message: `Role must be one of: ${validRoles.join(", ")}`,
        });
      }
      user.role = roleLower;
    }
    
    if (isBlocked !== undefined) {
      user.isBlocked = isBlocked;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE USER ROLE (Legacy endpoint - optional)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    const validRoles = ["user", "admin", "driver", "placeowner"];
    const roleLower = role.toLowerCase();
    if (!validRoles.includes(roleLower)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${validRoles.join(", ")}`,
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = roleLower;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// TOGGLE BLOCK USER STATUS (Legacy endpoint - optional)
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  updateUserRole,
  toggleBlockUser,
  deleteUser,
};