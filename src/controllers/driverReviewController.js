const DriverProfile = require("../models/Driver");
const DriverReview = require("../models/DriverReview");

exports.getDriverReviews = async (req, res) => {
  try {
    const profile = await DriverProfile.findOne({ driver: req.params.driverId });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Driver profile not found" });
    }

    const reviews = await DriverReview.find({ driver: req.params.driverId })
      .populate("reviewer", "firstName lastName profileImage")
      .sort("-createdAt");

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
      success: true,
      count: reviews.length,
      averageRating: Number(avgRating.toFixed(1)),
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDriverReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { driverId } = req.params;

    if (req.user.role === "driver" && String(req.user._id) === String(driverId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot review your own profile",
      });
    }

    const profile = await DriverProfile.findOne({ driver: driverId });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Driver profile not found" });
    }

    const review = await DriverReview.findOneAndUpdate(
      {
        driver: driverId,
        reviewer: req.user._id,
      },
      {
        driverProfile: profile._id,
        driver: driverId,
        reviewer: req.user._id,
        rating,
        comment,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).populate("reviewer", "firstName lastName profileImage");

    res.status(201).json({
      success: true,
      message: "Review saved successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};