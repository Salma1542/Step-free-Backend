const mongoose = require("mongoose");

// Cairo Areas
const CAIRO_AREAS = [
  "Nasr City",
  "Heliopolis",
  "New Cairo",
  "Maadi",
  "Zamalek",
  "Downtown Cairo",
  "Garden City",
  "Shubra",
  "Ain Shams",
  "El Marg",
  "Mokattam",
  "Abbassia",
  "Sayeda Zeinab",
  "El Rehab",
  "Madinaty",
  "Badr City",
  "Helwan",
  "Dar El Salam",
  "El Basatin",
  "15 May City",
];

const serviceAreaSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    governorate: {
      type: String,
      required: [true, "Please choose an area"],
      enum: {
        values: CAIRO_AREAS,
        message: "Invalid area",
      },
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// يمنع إضافة نفس المنطقة مرتين لنفس السواق
serviceAreaSchema.index(
  {
    driver: 1,
    governorate: 1,
  },
  {
    unique: true,
  }
);

serviceAreaSchema.statics.CAIRO_AREAS = CAIRO_AREAS;

module.exports = mongoose.model("ServiceArea", serviceAreaSchema);