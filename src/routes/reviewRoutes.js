const express = require("express");
const router = express.Router();
const {
  getReviewsByPlace,
  createReview,
} = require("../controllers/reviewController");
const protect = require("../middleware/authMiddleware");

// مسارات المراجعات لمكان معين
router.get("/places/:placeId/reviews", getReviewsByPlace);
router.post("/places/:placeId/reviews", protect, createReview);

module.exports = router;