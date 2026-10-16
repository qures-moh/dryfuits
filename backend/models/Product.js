const mongoose = require("mongoose");

const weightOptionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    weight: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    serves: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const nutritionSchema = new mongoose.Schema(
  {
    calories: {
      type: String,
      default: "",
      trim: true,
    },
    protein: {
      type: String,
      default: "",
      trim: true,
    },
    healthyFats: {
      type: String,
      default: "",
      trim: true,
    },
    carbs: {
      type: String,
      default: "",
      trim: true,
    },
    fiber: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      default: "GOLDEN HARVEST",
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    isBucket: {
      type: Boolean,
      default: false,
    },

    badge: {
      type: String,
      default: "",
      trim: true,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },

    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    shortDesc: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    gallery: [
      {
        type: String,
        trim: true,
      },
    ],

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    weightOptions: {
      type: [weightOptionSchema],
      default: [],
    },

    origin: {
      type: String,
      default: "",
      trim: true,
    },

    storage: {
      type: String,
      default: "",
      trim: true,
    },

    nutrition: {
      type: nutritionSchema,
      default: () => ({}),
    },

    benefits: [
      {
        type: String,
        trim: true,
      },
    ],

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);