const Review = require("../models/Review");
const Place = require("../models/Place");

// GET جميع المراجعات لمكان معين
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// إضافة مراجعة جديدة (للمستخدمين المسجلين فقط)
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

    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    const review = await Review.create({
      user: userId,
      place: placeId,
      rating,
      comment,
    });

    // تحديث reviewCount للمكان (اختياري)
    const totalReviews = await Review.countDocuments({ place: placeId });
    place.reviewCount = totalReviews;
    // يمكن حساب متوسط التقييم أيضًا
    const avg = await Review.aggregate([
      { $match: { place: place._id } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    place.rating = avg.length > 0 ? Math.round(avg[0].avgRating * 10) / 10 : 0;
    await place.save();

    // إعادة المراجعة مع بيانات المستخدم
    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "firstName lastName profileImage"
    );

    res.status(201).json({
      success: true,
      data: populatedReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = { getReviewsByPlace, createReview };