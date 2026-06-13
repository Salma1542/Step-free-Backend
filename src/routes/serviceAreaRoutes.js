const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const ctrl = require("../controllers/serviceAreaController");

// عام — قائمة محافظات مصر
router.get("/governorates", ctrl.getGovernorates);

// عام — البحث عن دريفرز فى محافظة معينة
router.get("/search", ctrl.searchDriversByGovernorate);

// محمى — لازم دريفر مسجّل دخوله
router.get("/", protect, ctrl.getMyAreas);
router.post("/", protect, ctrl.createArea);
router.put("/:id", protect, ctrl.updateArea);
router.delete("/:id", protect, ctrl.deleteArea);

module.exports = router;
