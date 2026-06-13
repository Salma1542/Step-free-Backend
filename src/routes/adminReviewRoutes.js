const express = require("express");

const router = express.Router();

const {
  getReviews,
  getReviewById,
  deleteReview,
} = require("../controllers/adminReviewController");


router.get("/reviews", getReviews);
router.get("/reviews/:id", getReviewById);
router.delete("/reviews/:id", deleteReview);

module.exports = router;