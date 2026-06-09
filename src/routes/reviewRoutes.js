// const express = require("express");
// const router = express.Router();
// const {
//   getReviewsByPlace,
//   createReview,
// } = require("../controllers/reviewController");
// const protect = require("../middleware/authMiddleware");

// // مسارات المراجعات لمكان معين
// router.get("/places/:placeId/reviews", getReviewsByPlace);
// router.post("/places/:placeId/reviews", protect, createReview);

// module.exports = router;



const express = require("express");
const router = express.Router();
const {
  getReviewsByPlace,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const protect = require("../middleware/authMiddleware");

router.get("/places/:placeId/reviews", getReviewsByPlace);
router.post("/places/:placeId/reviews", protect, createReview);
router.put("/reviews/:reviewId", protect, updateReview);
router.delete("/reviews/:reviewId", protect, deleteReview);

module.exports = router;