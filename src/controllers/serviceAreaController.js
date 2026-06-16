const ServiceArea = require("../models/ServiceArea");

// GET /api/driver/service-areas/governorates
// هنسيب نفس اسم الراوت عشان الفرونت أو أي كود قديم مايتكسرش
exports.getGovernorates = (req, res) => {
  res.json({
    success: true,
    data: ServiceArea.CAIRO_AREAS,
  });
};

// GET /api/driver/service-areas
exports.getMyAreas = async (req, res) => {
  try {
    const areas = await ServiceArea.find({ driver: req.user._id }).sort(
      "-createdAt"
    );

    res.json({
      success: true,
      count: areas.length,
      data: areas,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /api/driver/service-areas
// body: { governorate: "Zamalek" }
exports.createArea = async (req, res) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Only drivers can add service areas",
      });
    }

    const { governorate } = req.body;

    if (!governorate) {
      return res.status(400).json({
        success: false,
        message: "Area is required",
      });
    }

    if (!ServiceArea.CAIRO_AREAS.includes(governorate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid area",
      });
    }

    const area = await ServiceArea.create({
      driver: req.user._id,
      governorate,
    });

    res.status(201).json({
      success: true,
      data: area,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Area already added",
      });
    }

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// PUT /api/driver/service-areas/:id
// body: { governorate?, active? }
exports.updateArea = async (req, res) => {
  try {
    const update = {};

    if (req.body.governorate !== undefined) {
      if (!ServiceArea.CAIRO_AREAS.includes(req.body.governorate)) {
        return res.status(400).json({
          success: false,
          message: "Invalid area",
        });
      }

      update.governorate = req.body.governorate;
    }

    if (req.body.active !== undefined) {
      update.active = Boolean(req.body.active);
    }

    const area = await ServiceArea.findOneAndUpdate(
      {
        _id: req.params.id,
        driver: req.user._id,
      },
      update,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    res.json({
      success: true,
      data: area,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE /api/driver/service-areas/:id
exports.deleteArea = async (req, res) => {
  try {
    const area = await ServiceArea.findOneAndDelete({
      _id: req.params.id,
      driver: req.user._id,
    });

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    res.json({
      success: true,
      message: "Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.searchDriversByGovernorate = async (req, res) => {
  try {
    const { governorate } = req.query;

    if (!governorate) {
      return res.status(400).json({
        success: false,
        message: "Area is required",
      });
    }

    if (!ServiceArea.CAIRO_AREAS.includes(governorate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid area",
      });
    }

    const Driver = require("../models/Driver");
    const DriverReview = require("../models/DriverReview");

    const matched = await ServiceArea.find({
      governorate,
      active: true,
    }).populate("driver", "firstName lastName phone city profileImage");

    const data = await Promise.all(
      matched
        .filter((area) => area.driver)
        .map(async (area) => {
          const driverId = area.driver._id;

          let driverProfile = await Driver.findOne({ driver: driverId });

          if (!driverProfile) {
            driverProfile = await Driver.findById(driverId);
          }

          const reviews = await DriverReview.find({
            driver: driverId,
          });

          const avgRating =
            reviews.length > 0
              ? reviews.reduce((sum, review) => sum + review.rating, 0) /
                reviews.length
              : 0;

          return {
            _id: area._id,
            governorate: area.governorate,
            active: area.active,
            driver: area.driver,
            driverProfile,
            averageRating: Number(avgRating.toFixed(1)),
            reviewsCount: reviews.length,
          };
        })
    );

    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.log("SEARCH DRIVER ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};