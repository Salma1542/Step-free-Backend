const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const c = require("../controllers/driverProfileController");

// Public profile by driver user id
router.get("/profile/:driverId", c.getPublicProfile);

// Logged-in driver profile
router.get("/profile", auth, c.getProfile);

router.post(
  "/profile",
  auth,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "vehicle", maxCount: 1 },
  ]),
  c.upsertProfile
);

module.exports = router;