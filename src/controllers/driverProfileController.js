const DriverProfile = require("../models/Driver");

exports.getProfile = async (req, res) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Only drivers can access driver profile",
      });
    }

    const profile = await DriverProfile.findOne({
      driver: req.user._id,
    }).populate(
      "driver",
      "firstName lastName email phone city role profileImage"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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

    let accessibilityFeatures = req.body.accessibilityFeatures;

    if (typeof accessibilityFeatures === "string") {
      try {
        accessibilityFeatures = JSON.parse(accessibilityFeatures);
      } catch {
        accessibilityFeatures = [accessibilityFeatures];
      }
    }

    const existingProfile = await DriverProfile.findOne({
      driver: req.user._id,
    });

    const data = {
      driver: req.user._id,
      vehicleType: req.body.vehicleType,
      licensePlate: req.body.licensePlate,
      vehicleModel: req.body.vehicleModel,
      vehicleYear: Number(req.body.vehicleYear),
      accessibilityFeatures,
      availabilityFrom: req.body.availabilityFrom,
      availabilityTo: req.body.availabilityTo,
      licenseNumber: req.body.licenseNumber,
      profileCompleted: true,
    };

    if (req.files?.photo?.[0]) {
      data.photoUrl = req.files.photo[0].path;
    } else if (existingProfile?.photoUrl) {
      data.photoUrl = existingProfile.photoUrl;
    }

    if (req.files?.license?.[0]) {
      data.licenseImageUrl = req.files.license[0].path;
    } else if (existingProfile?.licenseImageUrl) {
      data.licenseImageUrl = existingProfile.licenseImageUrl;
    }

    if (req.files?.vehicle?.[0]) {
      data.vehicleImageUrl = req.files.vehicle[0].path;
    } else if (existingProfile?.vehicleImageUrl) {
      data.vehicleImageUrl = existingProfile.vehicleImageUrl;
    }

    const profile = await DriverProfile.findOneAndUpdate(
      { driver: req.user._id },
      data,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).populate(
      "driver",
      "firstName lastName email phone city role profileImage"
    );

    return res.json({
      success: true,
      message: "Driver profile saved successfully",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getPublicProfile = async (req, res) => {
  try {
    const profile = await DriverProfile.findOne({
      driver: req.params.driverId,
    }).populate(
      "driver",
      "firstName lastName email phone city role profileImage"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};