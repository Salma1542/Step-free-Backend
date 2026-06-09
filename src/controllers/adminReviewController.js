const Review = require("../models/Review");

const getReviews = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .populate("user", "firstName lastName")
      .populate("place", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalReviews = await Review.countDocuments();

    res.status(200).json({
      page,
      totalPages: Math.ceil(totalReviews / limit),
      totalReviews,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};





const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "firstName lastName")
      .populate("place", "name");

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};









const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getReviews,
  getReviewById,
  deleteReview,
};