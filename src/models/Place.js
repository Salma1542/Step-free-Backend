// // src/models/Place.js

// const mongoose = require("mongoose");

// const placeSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Place name is required"],
//       trim: true,
//       unique: true,
//     },

//     description: {
//       type: String,
//       required: [true, "Description is required"],
//     },

//     type: {
//       type: String,
//       enum: ["Restaurant", "Hospital", "Mall", "Hotel", "Cafe", "Bank"],
//       required: [true, "Place type is required"],
//     },

//     image: {
//       type: String,
//       required: [true, "Image URL is required"],
//     },

//     area: {
//       type: String,
//       required: [true, "Area/Location is required"],
//       trim: true,
//     },

//     distance: {
//       type: Number,
//       required: [true, "Distance is required"],
//     },

//     coordinates: {
//       type: {
//         type: String,
//         enum: ["Point"],
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number],
//         required: [true, "Coordinates are required"],
//       },
//     },

//     lat: {
//       type: Number,
//       required: [true, "Latitude is required"],
//     },

//     lng: {
//       type: Number,
//       required: [true, "Longitude is required"],
//     },

//     tags: {
//       type: [String],
//       enum: ["Ramp", "Elevator", "Wide Entrance", "Accessible Bathroom", "Parking", "AC"],
//       default: [],
//     },

//     rating: {
//       type: Number,
//       min: 0,
//       max: 5,
//       default: 0,
//     },

//     reviewCount: {
//       type: Number,
//       default: 0,
//     },

//     isAccessible: {
//       type: Boolean,
//       default: true,
//     },

//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },

//     updatedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// placeSchema.index({ name: "text", description: "text", area: "text" });
// placeSchema.index({ type: 1 });
// placeSchema.index({ "coordinates.coordinates": "2dsphere" });

// module.exports = mongoose.model("Place", placeSchema);



// const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema(
//   {
//     user: {
//       id: { type: String, required: true },
//       name: { type: String, required: true },
//       avatar: { type: String, default: "" },
//     },
//     rating: { type: Number, required: true, min: 1, max: 5 },
//     comment: { type: String, required: true },
//     date: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// const placeSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Place name is required"],
//       trim: true,
//       unique: true,
//     },
//     description: {
//       type: String,
//       required: [true, "Description is required"],
//     },
//     type: {
//       type: String,
//       enum: ["Restaurant", "Hospital", "Mall", "Hotel", "Cafe", "Bank"],
//       required: [true, "Place type is required"],
//     },
//     image: {
//       type: String,
//       required: [true, "Image URL is required"],
//     },
//     // ✅ مصفوفة الصور الإضافية (المعرض)
//     images: [
//       {
//         src: { type: String, required: true },
//         alt: { type: String, default: "" },
//       },
//     ],
//     area: {
//       type: String,
//       required: [true, "Area/Location is required"],
//       trim: true,
//     },
//     district: {
//       type: String,
//       default: "",
//     },
//     distance: {
//       type: Number,
//       required: [true, "Distance is required"],
//     },
//     coordinates: {
//       type: {
//         type: String,
//         enum: ["Point"],
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number],
//         required: [true, "Coordinates are required"],
//       },
//     },
//     lat: {
//       type: Number,
//       required: [true, "Latitude is required"],
//     },
//     lng: {
//       type: Number,
//       required: [true, "Longitude is required"],
//     },
//     tags: {
//       type: [String],
//       enum: ["Ramp", "Elevator", "Wide Entrance", "Accessible Bathroom", "Parking", "AC"],
//       default: [],
//     },
//     // ✅ مميزات الوصول
//     features: [
//       {
//         icon: { type: String, required: true },
//         label: { type: String, required: true },
//         subtext: { type: String, default: "" },
//       },
//     ],
//     // ✅ مراجعات المستخدمين
//     reviews: [reviewSchema],
//     rating: {
//       type: Number,
//       min: 0,
//       max: 5,
//       default: 0,
//     },
//     reviewCount: {
//       type: Number,
//       default: 0,
//     },
//     isAccessible: {
//       type: Boolean,
//       default: true,
//     },
//     // ✅ إشارة للسائقين المرتبطين (اختياري)
//     drivers: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Driver",
//       },
//     ],
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     updatedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // الفهارس
// placeSchema.index({ name: "text", description: "text", area: "text" });
// placeSchema.index({ type: 1 });
// placeSchema.index({ "coordinates.coordinates": "2dsphere" });

// module.exports = mongoose.model("Place", placeSchema);





// src/models/Place.js
const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Place name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    type: {
      type: String,
      enum: ["Restaurant", "Hospital", "Mall", "Hotel", "Cafe", "Bank"],
      required: [true, "Place type is required"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    // صور المعرض
    images: [
      {
        src: { type: String, required: true },
        alt: { type: String, default: "" },
      },
    ],
    area: {
      type: String,
      required: [true, "Area/Location is required"],
      trim: true,
    },
    district: {
      type: String,
      default: "",
    },
    distance: {
      type: Number,
      required: [true, "Distance is required"],
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: [true, "Coordinates are required"],
      },
    },
    lat: {
      type: Number,
      required: [true, "Latitude is required"],
    },
    lng: {
      type: Number,
      required: [true, "Longitude is required"],
    },
    tags: {
      type: [String],
      enum: ["Ramp", "Elevator", "Wide Entrance", "Accessible Bathroom", "Parking", "AC"],
      default: [],
    },
    // مميزات الوصول
    features: [
      {
        icon: { type: String, required: true },
        label: { type: String, required: true },
        subtext: { type: String, default: "" },
      },
    ],
    // التقييم وعدد المراجعات (يتم حسابهم من جدول المراجعات المستقل)
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isAccessible: {
      type: Boolean,
      default: true,
    },
    status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
},
    // إشارة للسائقين المرتبطين (اختياري)
    drivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// الفهارس
placeSchema.index({ name: "text", description: "text", area: "text" });
placeSchema.index({ type: 1 });
placeSchema.index({ "coordinates.coordinates": "2dsphere" });

module.exports = mongoose.model("Place", placeSchema);