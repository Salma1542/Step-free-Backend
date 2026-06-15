const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.upsertProfile = async (req, res) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Only drivers can complete a driver profile",
      });
    }

    const allowedFields = [
      "vehicleType",
      "licensePlate",
      "vehicleModel",
      "vehicleYear",
      "accessibilityFeatures",
      "availabilityFrom",
      "availabilityTo",
      "licenseNumber",
    ];

    const data = { profileCompleted: true };

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    });

    if (data.vehicleYear !== undefined) {
      data.vehicleYear = Number(data.vehicleYear);
    }

    if (req.files?.photo?.[0]) {
      data.photoUrl = `/uploads/${req.files.photo[0].filename}`;
      data.profileImage = data.photoUrl;
    }

    if (req.files?.license?.[0]) {
      data.licenseImageUrl = `/uploads/${req.files.license[0].filename}`;
    }

    if (req.files?.vehicle?.[0]) {
      data.vehicleImageUrl = `/uploads/${req.files.vehicle[0].filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
