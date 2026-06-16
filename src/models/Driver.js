const mongoose = require("mongoose");

const driverProfileSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    photoUrl: String,

    vehicleType: {
      type: String,
      enum: ["Car", "Van", "Bus", "SUV", "Other"],
      required: true,
    },

    licensePlate: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleModel: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleYear: {
      type: Number,
      required: true,
    },

    accessibilityFeatures: [
      {
        type: String,
      },
    ],

    availabilityFrom: {
      type: String,
      required: true,
    },

    availabilityTo: {
      type: String,
      required: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      trim: true,
    },

    licenseImageUrl: {
      type: String,
      required: true,
    },

    vehicleImageUrl: {
      type: String,
      required: true,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DriverProfile", driverProfileSchema);