const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
  updateNotificationSettings,
} = require("../controllers/adminSettingsController");

router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);
router.patch("/notification-settings", protect, updateNotificationSettings);

module.exports = router;