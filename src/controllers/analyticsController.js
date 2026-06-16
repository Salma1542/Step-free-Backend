// controllers/analyticsController.js
const User = require('../models/User');
const Place = require('../models/Place');
const Review = require('../models/Review');

exports.getAnalytics = async (req, res) => {
  try {
    const { timeRange = 'month' } = req.query;

    // حساب التاريخ
    let startDate = new Date();
    if (timeRange === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    // حساب الفترة السابقة (للمقارنة)
    let prevStartDate = new Date(startDate);
    if (timeRange === 'week') {
      prevStartDate.setDate(prevStartDate.getDate() - 7);
    } else {
      prevStartDate.setMonth(prevStartDate.getMonth() - 1);
    }
    let prevEndDate = new Date(startDate);

    // ==================== 1. USERS ====================
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startDate },
    });
    const prevUsers = await User.countDocuments({
      createdAt: { $gte: prevStartDate, $lt: prevEndDate },
    });
    const userChange = prevUsers ? Math.round(((newUsersThisMonth - prevUsers) / prevUsers) * 100) : 100;

    // ==================== 2. PLACES ====================
    const totalPlaces = await Place.countDocuments({ status: 'accepted' });
    const newPlacesThisMonth = await Place.countDocuments({
      status: 'accepted',
      createdAt: { $gte: startDate },
    });
    const prevPlaces = await Place.countDocuments({
      status: 'accepted',
      createdAt: { $gte: prevStartDate, $lt: prevEndDate },
    });
    const placesChange = prevPlaces ? Math.round(((newPlacesThisMonth - prevPlaces) / prevPlaces) * 100) : 100;

    // ==================== 3. REVIEWS ====================
    const totalReviews = await Review.countDocuments();
    const newReviewsThisMonth = await Review.countDocuments({
      createdAt: { $gte: startDate },
    });
    const prevReviews = await Review.countDocuments({
      createdAt: { $gte: prevStartDate, $lt: prevEndDate },
    });
    const reviewsChange = prevReviews ? Math.round(((newReviewsThisMonth - prevReviews) / prevReviews) * 100) : 100;

    // ==================== 4. USER TREND ====================
    let userTrend = [];
    if (timeRange === 'month') {
      // آخر 6 شهور
      const months = ['January', 'February', 'March', 'April', 'May', 'June'];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        const count = await User.countDocuments({
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        });

        userTrend.push({
          label: months[startOfMonth.getMonth()],
          value: count,
        });
      }
    } else {
      // آخر 6 أيام
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        const count = await User.countDocuments({
          createdAt: { $gte: startOfDay, $lt: endOfDay },
        });

        userTrend.push({
          label: date.toLocaleDateString('en-US', { weekday: 'short' }),
          value: count,
        });
      }
    }

    // ==================== 5. PLACES BY TYPE ====================
    const placesByTypeAgg = await Place.aggregate([
      { $match: { status: 'accepted' } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $project: { label: '$_id', value: '$count', _id: 0 } },
      { $sort: { value: -1 } },
    ]);

    // Ensure all types are included
    const typeMap = {
      Restaurant: 0,
      Hospital: 0,
      Mall: 0,
      Hotel: 0,
      Cafe: 0,
      Bank: 0,
    };

    placesByTypeAgg.forEach((item) => {
      typeMap[item.label] = item.value;
    });

    const placesByType = Object.entries(typeMap).map(([label, value]) => ({
      label,
      value,
    }));

    // ==================== 6. RATING DISTRIBUTION ====================
    const ratingDistribution = [
      { label: '5 Stars', value: 0 },
      { label: '4 Stars', value: 0 },
      { label: '3 Stars', value: 0 },
      { label: '2 Stars', value: 0 },
      { label: '1 Star', value: 0 },
    ];

    const ratings = await Review.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]);

    ratings.forEach((r) => {
      const index = 5 - r._id;
      if (index >= 0 && index < 5) {
        ratingDistribution[index].value = r.count;
      }
    });

    // ==================== 7. TOP PLACES ====================
    const topPlaces = await Place.aggregate([
      { $match: { status: 'accepted' } },
      { $sort: { rating: -1, reviewCount: -1 } },
      { $limit: 4 },
      {
        $project: {
          name: 1,
          reviews: '$reviewCount',
          rating: 1,
          _id: 0,
        },
      },
    ]);

    // ==================== RESPONSE ====================
    res.status(200).json({
      success: true,
      data: {
        summary: {
          users: totalUsers,
          places: totalPlaces,
          reviews: totalReviews,
          bookings: 0,
          userChange,
          placesChange,
          reviewsChange,
          bookingsChange: 0,
        },
        charts: {
          userTrend,
          placesByType,
          ratingDistribution,
          topPlaces,
        },
      },
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};