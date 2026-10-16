const mongoose = require("mongoose");
const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return res.json(products);
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }

    if (!product) {
      // Allow fallback lookup by name or slug match
      product = await Product.findOne({
        name: { $regex: new RegExp(`^${id.replace(/-/g, " ")}$`, "i") },
      }).lean();
    }

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json(product);
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      isBucket,
      badge,
      inStock,
      rating,
      reviewsCount,
      shortDesc,
      description,
      image,
      gallery,
      basePrice,
      weightOptions,
      origin,
      storage,
      nutrition,
      benefits,
      sortOrder,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    if (basePrice === undefined || Number(basePrice) < 0) {
      return res.status(400).json({
        message: "Valid base price is required",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      brand: brand?.trim() || "GOLDEN HARVEST",
      category: category.trim(),
      isBucket: Boolean(isBucket),
      badge: badge?.trim() || "",
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      rating: rating !== undefined ? Number(rating) : 4.5,
      reviewsCount:
        reviewsCount !== undefined ? Number(reviewsCount) : 0,
      shortDesc: shortDesc?.trim() || "",
      description: description?.trim() || "",
      image: image?.trim() || "",
      gallery: Array.isArray(gallery) ? gallery : [],
      basePrice: Number(basePrice),
      weightOptions: Array.isArray(weightOptions)
        ? weightOptions
        : [],
      origin: origin?.trim() || "",
      storage: storage?.trim() || "",
      nutrition: nutrition || {},
      benefits: Array.isArray(benefits) ? benefits : [],
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "brand",
      "category",
      "isBucket",
      "badge",
      "inStock",
      "rating",
      "reviewsCount",
      "shortDesc",
      "description",
      "image",
      "gallery",
      "basePrice",
      "weightOptions",
      "origin",
      "storage",
      "nutrition",
      "benefits",
      "sortOrder",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (updateData.name !== undefined) {
      updateData.name = String(updateData.name).trim();
    }

    if (updateData.brand !== undefined) {
      updateData.brand = String(updateData.brand).trim();
    }

    if (updateData.category !== undefined) {
      updateData.category = String(updateData.category).trim();
    }

    if (updateData.basePrice !== undefined) {
      updateData.basePrice = Number(updateData.basePrice);
    }

    if (updateData.rating !== undefined) {
      updateData.rating = Number(updateData.rating);
    }

    if (updateData.reviewsCount !== undefined) {
      updateData.reviewsCount = Number(updateData.reviewsCount);
    }

    if (updateData.sortOrder !== undefined) {
      updateData.sortOrder = Number(updateData.sortOrder);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json(product);
  } catch (error) {
    console.error("Update product error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};