const mongoose = require("mongoose");

// قائمة محافظات مصر
const EGYPT_GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira",
  "Fayoum", "Gharbiya", "Ismailia", "Menofia", "Minya", "Qaliubiya",
  "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said",
  "Damietta", "Sharkia", "South Sinai", "Kafr El Sheikh", "Matrouh",
  "Luxor", "Qena", "North Sinai", "Sohag",
];

// المحافظات اللى الدريفر يقدر يوصل ليها المستخدمين فيها
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
      required: [true, "Please choose a governorate"],
      enum: EGYPT_GOVERNORATES,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// كل دريفر مينفعش يضيف نفس المحافظة مرتين
serviceAreaSchema.index({ driver: 1, governorate: 1 }, { unique: true });

serviceAreaSchema.statics.GOVERNORATES = EGYPT_GOVERNORATES;

module.exports = mongoose.model("ServiceArea", serviceAreaSchema);
