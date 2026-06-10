// const Review = require("../models/Review");
// const Place = require("../models/Place");

// // GET جميع المراجعات لمكان معين
// const getReviewsByPlace = async (req, res) => {
//   try {
//     const { placeId } = req.params;
//     const reviews = await Review.find({ place: placeId })
//       .populate("user", "firstName lastName profileImage")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: reviews,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // إضافة مراجعة جديدة (للمستخدمين المسجلين فقط)
// const createReview = async (req, res) => {
//   try {
//     const { placeId } = req.params;
//     const { rating, comment } = req.body;
//     const userId = req.user._id;

//     if (!rating || !comment) {
//       return res.status(400).json({
//         success: false,
//         message: "Rating and comment are required",
//       });
//     }

//     const place = await Place.findById(placeId);
//     if (!place) {
//       return res.status(404).json({ success: false, message: "Place not found" });
//     }

//     const review = await Review.create({
//       user: userId,
//       place: placeId,
//       rating,
//       comment,
//     });

//     // تحديث reviewCount للمكان (اختياري)
//     const totalReviews = await Review.countDocuments({ place: placeId });
//     place.reviewCount = totalReviews;
//     // يمكن حساب متوسط التقييم أيضًا
//     const avg = await Review.aggregate([
//       { $match: { place: place._id } },
//       { $group: { _id: null, avgRating: { $avg: "$rating" } } },
//     ]);
//     place.rating = avg.length > 0 ? Math.round(avg[0].avgRating * 10) / 10 : 0;
//     await place.save();

//     // إعادة المراجعة مع بيانات المستخدم
//     const populatedReview = await Review.findById(review._id).populate(
//       "user",
//       "firstName lastName profileImage"
//     );

//     res.status(201).json({
//       success: true,
//       data: populatedReview,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



// module.exports = { getReviewsByPlace, createReview };


const mongoose = require("mongoose");
const Review = require("../models/Review");
const Place = require("../models/Place");

// @desc    Get all reviews for a place
// @route   GET /api/places/:placeId/reviews
// @access  Public
const getReviewsByPlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    const reviews = await Review.find({ place: placeId })
      .populate("user", "firstName lastName profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create a review for a place
// @route   POST /api/places/:placeId/reviews
// @access  Private (authenticated users)
const createReview = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required",
      });
    }

    // لا يوجد قيد على عدد المراجعات للمستخدم الواحد
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    const review = await Review.create({
      user: userId,
      place: placeId,
      rating,
      comment,
    });

    // تحديث إحصائيات المكان
    await updatePlaceStats(placeId);

    const populatedReview = await Review.findById(review._id)
      .populate("user", "firstName lastName profileImage");

    res.status(201).json({
      success: true,
      data: populatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update a review (owner only)
// @route   PUT /api/reviews/:reviewId
// @access  Private (owner)
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // التحقق من ملكية المراجعة
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this review",
      });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();
    await updatePlaceStats(review.place);

    const updatedReview = await Review.findById(review._id)
      .populate("user", "firstName lastName profileImage");

    res.status(200).json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a review (owner only)
// @route   DELETE /api/reviews/:reviewId
// @access  Private (owner)
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    const placeId = review.place;
    await review.deleteOne();
    await updatePlaceStats(placeId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// دالة مساعدة لتحديث إحصائيات المكان
const updatePlaceStats = async (placeId) => {
  const totalReviews = await Review.countDocuments({ place: placeId });
  const avg = await Review.aggregate([
    { $match: { place: new mongoose.Types.ObjectId(placeId) } },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } },
  ]);
  const rating = avg.length > 0 ? Math.round(avg[0].avgRating * 10) / 10 : 0;
  await Place.findByIdAndUpdate(placeId, {
    reviewCount: totalReviews,
    rating,
  });
};

module.exports = {
  getReviewsByPlace,
  createReview,
  updateReview,
  deleteReview,
};