const ServiceArea = require("../models/ServiceArea");

// GET /api/driver/service-areas/governorates  -> قائمة محافظات مصر الثابتة
exports.getGovernorates = (req, res) => {
  res.json({ success: true, data: ServiceArea.GOVERNORATES });
};

// GET /api/driver/service-areas  -> كل المحافظات بتاعت الدريفر الحالى
exports.getMyAreas = async (req, res) => {
  try {
    const areas = await ServiceArea.find({ driver: req.user._id }).sort("-createdAt");
    res.json({ success: true, count: areas.length, data: areas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/driver/service-areas   { governorate }
exports.createArea = async (req, res) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).json({ success: false, message: "Only drivers can add service areas" });
    }
    const { governorate } = req.body;
    if (!governorate) {
      return res.status(400).json({ success: false, message: "governorate is required" });
    }
    if (!ServiceArea.GOVERNORATES.includes(governorate)) {
      return res.status(400).json({ success: false, message: "Invalid governorate" });
    }
    const area = await ServiceArea.create({
      driver: req.user._id,
      governorate,
    });
    res.status(201).json({ success: true, data: area });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Governorate already added" });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/driver/service-areas/:id   { governorate?, active? }
exports.updateArea = async (req, res) => {
  try {
    const update = {};
    if (req.body.governorate !== undefined) {
      if (!ServiceArea.GOVERNORATES.includes(req.body.governorate)) {
        return res.status(400).json({ success: false, message: "Invalid governorate" });
      }
      update.governorate = req.body.governorate;
    }
    if (req.body.active !== undefined) update.active = !!req.body.active;

    const area = await ServiceArea.findOneAndUpdate(
      { _id: req.params.id, driver: req.user._id },
      update,
      { new: true, runValidators: true }
    );
    if (!area) return res.status(404).json({ success: false, message: "Area not found" });
    res.json({ success: true, data: area });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/driver/service-areas/:id
exports.deleteArea = async (req, res) => {
  try {
    const area = await ServiceArea.findOneAndDelete({ _id: req.params.id, driver: req.user._id });
    if (!area) return res.status(404).json({ success: false, message: "Area not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/driver/service-areas/search?governorate=Cairo
// (عام) المستخدم يدور على درايفرز فى محافظة معينة
exports.searchDriversByGovernorate = async (req, res) => {
  try {
    const { governorate } = req.query;
    if (!governorate) {
      return res.status(400).json({ success: false, message: "governorate is required" });
    }
    const matched = await ServiceArea.find({ governorate, active: true }).populate(
      "driver",
      "firstName lastName phone city profileImage"
    );
    res.json({ success: true, count: matched.length, data: matched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
