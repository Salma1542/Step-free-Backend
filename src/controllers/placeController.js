// // src/controllers/placeController.js

// const Place = require("../models/Place");

// const getAllPlaces = async (req, res) => {
//   try {
//     const { category, search, limit = 20, page = 1 } = req.query;

//     let filter = {};

//     if (category && category !== "All") {
//       filter.type = category;
//     }

//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { area: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//       ];
//     }

//     const skip = (page - 1) * limit;

//     const places = await Place.find(filter)
//       .limit(parseInt(limit))
//       .skip(skip)
//       .sort({ createdAt: -1 });

//     const total = await Place.countDocuments(filter);

//     res.status(200).json({
//       success: true,
//       message: "Places fetched successfully",
//       data: places,
//       pagination: {
//         total,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const getPlaceById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid place ID",
//       });
//     }

//     const place = await Place.findById(id);

//     if (!place) {
//       return res.status(404).json({
//         success: false,
//         message: "Place not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Place fetched successfully",
//       data: place,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const createPlace = async (req, res) => {
//   try {
//     const { name, description, type, image, area, distance, lat, lng, tags, rating } = req.body;

//     if (!name || !description || !type || !area || lat === undefined || lng === undefined) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields: name, description, type, area, lat, lng",
//       });
//     }

//     const validTypes = ["Restaurant", "Hospital", "Mall", "Hotel", "Cafe", "Bank"];
//     if (!validTypes.includes(type)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
//       });
//     }

//     const newPlace = new Place({
//       name,
//       description,
//       type,
//       image,
//       area,
//       distance: distance || 0,
//       lat,
//       lng,
//       coordinates: {
//         type: "Point",
//         coordinates: [parseFloat(lng), parseFloat(lat)],
//       },
//       tags: tags || [],
//       rating: rating || 0,
//     });

//     await newPlace.save();

//     res.status(201).json({
//       success: true,
//       message: "Place created successfully",
//       data: newPlace,
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: `Place with name "${error.keyValue.name}" already exists`,
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const updatePlace = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid place ID",
//       });
//     }

//     if (updates.lat && updates.lng) {
//       updates.coordinates = {
//         type: "Point",
//         coordinates: [updates.lng, updates.lat],
//       };
//     }

//     const updatedPlace = await Place.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     );

//     if (!updatedPlace) {
//       return res.status(404).json({
//         success: false,
//         message: "Place not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Place updated successfully",
//       data: updatedPlace,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const deletePlace = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid place ID",
//       });
//     }

//     const deletedPlace = await Place.findByIdAndDelete(id);

//     if (!deletedPlace) {
//       return res.status(404).json({
//         success: false,
//         message: "Place not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Place deleted successfully",
//       data: deletedPlace,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const getNearbyPlaces = async (req, res) => {
//   try {
//     const { lat, lng, maxDistance = 5000 } = req.query;

//     if (!lat || !lng) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide latitude and longitude",
//       });
//     }

//     const places = await Place.find({
//       coordinates: {
//         $near: {
//           $geometry: {
//             type: "Point",
//             coordinates: [parseFloat(lng), parseFloat(lat)],
//           },
//           $maxDistance: maxDistance,
//         },
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Nearby places fetched successfully",
//       data: places,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   getAllPlaces,
//   getPlaceById,
//   createPlace,
//   updatePlace,
//   deletePlace,
//   getNearbyPlaces,
// };



const Place = require("../models/Place");

const getAllPlaces = async (req, res) => {
  try {
    const { category, search, limit = 20, page = 1 } = req.query;

    let filter = {};

    if (category && category !== "All") {
      filter.type = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const places = await Place.find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Place.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Places fetched successfully",
      data: places,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid place ID",
      });
    }

    // لو عايز تحمّل السائقين مع المكان، استخدم populate
    // لكن حالياً هنتركها بدون populate لأننا بنجيب السائقين من API منفصل
    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Place fetched successfully",
      data: place,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createPlace = async (req, res) => {
  try {
    const {
      name, description, type, image, area, distance, lat, lng, tags, rating,
      district, images, features, reviews, drivers, isAccessible, reviewCount
    } = req.body;

    // التحقق من الحقول المطلوبة الأساسية
    if (!name || !description || !type || !area || lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, description, type, area, lat, lng",
      });
    }

    const validTypes = ["Restaurant", "Hospital", "Mall", "Hotel", "Cafe", "Bank"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    // تجهيز كائن المكان الجديد
    const newPlace = new Place({
      name,
      description,
      type,
      image,                     // الصورة الرئيسية
      area,
      district: district || "",
      distance: distance || 0,
      lat,
      lng,
      coordinates: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      tags: tags || [],
      rating: rating || 0,
      features: features || [],
      images: images || [],     // صور المعرض
      reviews: reviews || [],
      reviewCount: reviewCount !== undefined ? reviewCount : (reviews ? reviews.length : 0),
      isAccessible: isAccessible !== undefined ? isAccessible : true,
      drivers: drivers || [],   // مصفوفة ObjectIds للسائقين (اختياري)
    });

    await newPlace.save();

    res.status(201).json({
      success: true,
      message: "Place created successfully",
      data: newPlace,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Place with name "${error.keyValue.name}" already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid place ID",
      });
    }

    // لو تم تحديث الإحداثيات
    if (updates.lat !== undefined && updates.lng !== undefined) {
      updates.coordinates = {
        type: "Point",
        coordinates: [parseFloat(updates.lng), parseFloat(updates.lat)],
      };
    }

    // احتساب reviewCount تلقائيًا إذا تم إرسال reviews جديدة
    if (updates.reviews) {
      updates.reviewCount = updates.reviews.length;
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedPlace) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Place updated successfully",
      data: updatedPlace,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePlace = async (req, res) => {
  // لم تتغير
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid place ID",
      });
    }

    const deletedPlace = await Place.findByIdAndDelete(id);

    if (!deletedPlace) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Place deleted successfully",
      data: deletedPlace,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getNearbyPlaces = async (req, res) => {
  // لم تتغير
  try {
    const { lat, lng, maxDistance = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Please provide latitude and longitude",
      });
    }

    const places = await Place.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: maxDistance,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Nearby places fetched successfully",
      data: places,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  getNearbyPlaces,
};