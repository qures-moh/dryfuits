const Product = require("../models/Product");
const Category = require("../models/Category");
const Testimonial = require("../models/Testimonial");
const FAQ = require("../models/FAQ");

exports.getDashboard = async (req, res) => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalTestimonials,
      totalFaqs,
      activeProducts,
      bucketProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Testimonial.countDocuments(),
      FAQ.countDocuments(),
      Product.countDocuments({ inStock: true }),
      Product.countDocuments({ isBucket: true }),
    ]);

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name price basePrice image category inStock createdAt");

    res.status(200).json({
      stats: {
        totalProducts,
        totalCategories,
        totalTestimonials,
        totalFaqs,
        activeProducts,
        bucketProducts,
      },
      recentProducts,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
};