const mongoose = require("mongoose");

const customStudioItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["container", "filler", "ribbon"],
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    // Container specific
    material: {
      type: String,
      default: "",
      trim: true,
    },
    capacity: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "/images/bucket_hamper.jpg",
      trim: true,
    },
    badge: {
      type: String,
      default: "",
      trim: true,
    },
    // Filler specific
    category: {
      type: String,
      default: "Nuts",
      trim: true,
    },
    icon: {
      type: String,
      default: "🌰",
      trim: true,
    },
    weight: {
      type: Number,
      default: 150,
      min: 0,
    },
    // Ribbon specific
    color: {
      type: String,
      default: "#eab308",
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CustomStudioItem", customStudioItemSchema);
