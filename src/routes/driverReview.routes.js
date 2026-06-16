const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const c = require("../controllers/driverReviewController");

router.get("/:driverId", c.getDriverReviews);
router.post("/:driverId", auth, c.createDriverReview);

module.exports = router;