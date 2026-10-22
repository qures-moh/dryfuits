const mongoose = require("mongoose");
const Product = require("../models/Product");
const Badge = require("../models/Badge");

const formatProductBadge = (product) => {
  if (!product) return product;
  const p = typeof product.toObject === "function" ? product.toObject() : { ...product };

  if (p.badge && typeof p.badge === "object" && p.badge.name) {
    p.badgeId = p.badge._id;
    p.badgeData = p.badge;
    p.badge = p.badge.isActive !== false ? p.badge.name : "";
  } else if (typeof p.badge === "string") {
    p.badge = p.badge.trim();
  } else {
    p.badge = "";
  }

  return p;
};

const resolveBadgeId = async (badgeInput) => {
  if (badgeInput === null || badgeInput === undefined) return null;
  if (typeof badgeInput === "string" && !badgeInput.trim()) return null;

  const Badge = require("../models/Badge");

  // If already a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(badgeInput)) {
    const existingBadge = await Badge.findById(badgeInput);
    if (existingBadge) {
      return existingBadge._id;
    }
  }

  // If it's a string name (e.g. "Best Seller", "Crunchy", etc.)
  if (typeof badgeInput === "string") {
    const trimmed = badgeInput.trim();
    if (!trimmed) return null;

    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let badgeDoc = await Badge.findOne({
      name: { $regex: new RegExp(`^${escaped}$`, "i") },
    });

    if (!badgeDoc) {
      badgeDoc = await Badge.create({
        name: trimmed,
        isActive: true,
      });
    }

    return badgeDoc._id;
  }

  return null;
};

exports.getAllProducts = async (req, res) => {
  try {
    let products;
    try {
      products = await Product.find()
        .populate("badge", "name isActive")
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean();
    } catch (popError) {
      if (popError.name === "CastError") {
        console.warn("Retrying products fetch after migrating badges:", popError.message);
        const migrateBadges = require("../utils/migrateBadges");
        await migrateBadges();
        products = await Product.find()
          .populate("badge", "name isActive")
          .sort({ sortOrder: 1, createdAt: -1 })
          .lean();
      } else {
        throw popError;
      }
    }

    return res.json(products.map(formatProductBadge));
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

    const findWithPopulate = async () => {
      let prod = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        prod = await Product.findById(id)
          .populate("badge", "name isActive")
          .lean();
      }

      if (!prod) {
        prod = await Product.findOne({
          name: {
            $regex: new RegExp(
              `^${id.replace(/-/g, " ")}$`,
              "i"
            ),
          },
        })
          .populate("badge", "name isActive")
          .lean();
      }
      return prod;
    };

    try {
      product = await findWithPopulate();
    } catch (popError) {
      if (popError.name === "CastError") {
        const migrateBadges = require("../utils/migrateBadges");
        await migrateBadges();
        product = await findWithPopulate();
      } else {
        throw popError;
      }
    }

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json(formatProductBadge(product));
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

    const resolvedBadgeId = await resolveBadgeId(badge);

    let galleryArray = [];

    if (Array.isArray(gallery)) {
      galleryArray = gallery
        .filter(
          (img) =>
            typeof img === "string" &&
            img.trim()
        )
        .map((img) => img.trim());
    } else if (
      typeof gallery === "string" &&
      gallery.trim()
    ) {
      galleryArray = [gallery.trim()];
    }

    const primaryImage =
      (typeof image === "string" &&
        image.trim()) ||
      galleryArray[0] ||
      "";

    if (
      primaryImage &&
      !galleryArray.includes(primaryImage)
    ) {
      galleryArray.unshift(primaryImage);
    }

    galleryArray = galleryArray.slice(0, 5);

    const product = await Product.create({
      name: name.trim(),
      brand: brand?.trim() || "GOLDEN HARVEST",
      category: category.trim(),
      isBucket: Boolean(isBucket),

      badge: resolvedBadgeId,

      inStock:
        inStock !== undefined
          ? Boolean(inStock)
          : true,

      rating:
        rating !== undefined
          ? Number(rating)
          : 4.5,

      reviewsCount:
        reviewsCount !== undefined
          ? Number(reviewsCount)
          : 0,

      shortDesc:
        shortDesc?.trim() || "",

      description:
        description?.trim() || "",

      image: primaryImage,

      gallery: galleryArray,

      basePrice: Number(basePrice),

      weightOptions:
        Array.isArray(weightOptions)
          ? weightOptions
          : [],

      origin:
        origin?.trim() || "",

      storage:
        storage?.trim() || "",

      nutrition: nutrition || {},

      benefits:
        Array.isArray(benefits)
          ? benefits
          : [],

      sortOrder:
        sortOrder !== undefined
          ? Number(sortOrder)
          : 0,
    });

    const populatedProduct =
      await Product.findById(product._id)
        .populate("badge", "name isActive")
        .lean();

    return res.status(201).json(
      formatProductBadge(populatedProduct)
    );
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

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
        updateData[field] =
          req.body[field];
      }
    }

    if (updateData.name !== undefined) {
      updateData.name =
        String(updateData.name).trim();
    }

    if (updateData.brand !== undefined) {
      updateData.brand =
        String(updateData.brand).trim();
    }

    if (updateData.category !== undefined) {
      updateData.category =
        String(updateData.category).trim();
    }

    if (updateData.badge !== undefined) {
      updateData.badge = await resolveBadgeId(updateData.badge);
    }

    if (updateData.basePrice !== undefined) {
      updateData.basePrice =
        Number(updateData.basePrice);
    }

    if (updateData.rating !== undefined) {
      updateData.rating =
        Number(updateData.rating);
    }

    if (
      updateData.reviewsCount !== undefined
    ) {
      updateData.reviewsCount =
        Number(updateData.reviewsCount);
    }

    if (updateData.sortOrder !== undefined) {
      updateData.sortOrder =
        Number(updateData.sortOrder);
    }

    if (updateData.gallery !== undefined) {
      if (
        Array.isArray(
          updateData.gallery
        )
      ) {
        updateData.gallery =
          updateData.gallery
            .filter(
              (img) =>
                typeof img === "string" &&
                img.trim()
            )
            .map((img) =>
              img.trim()
            )
            .slice(0, 5);
      } else if (
        typeof updateData.gallery ===
          "string" &&
        updateData.gallery.trim()
      ) {
        updateData.gallery = [
          updateData.gallery.trim(),
        ];
      } else {
        updateData.gallery = [];
      }
    }

    if (updateData.image !== undefined) {
      updateData.image =
        typeof updateData.image ===
        "string"
          ? updateData.image.trim()
          : "";

      if (
        updateData.image &&
        (!updateData.gallery ||
          updateData.gallery.length === 0)
      ) {
        updateData.gallery = [
          updateData.image,
        ];
      } else if (
        updateData.image &&
        updateData.gallery &&
        !updateData.gallery.includes(
          updateData.image
        )
      ) {
        updateData.gallery.unshift(
          updateData.image
        );

        if (
          updateData.gallery.length > 5
        ) {
          updateData.gallery =
            updateData.gallery.slice(
              0,
              5
            );
        }
      }
    } else if (
      updateData.gallery &&
      updateData.gallery.length > 0
    ) {
      updateData.image =
        updateData.gallery[0];
    }

    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "badge",
          "name isActive"
        );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json(formatProductBadge(product));
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    if (
      error.name === "CastError"
    ) {
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
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json({
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};