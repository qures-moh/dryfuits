const Category = require("../models/Category");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { categoryId, name, icon, sortOrder } = req.body;

    if (!categoryId?.trim() || !name?.trim()) {
      return res.status(400).json({
        message: "Category ID and name are required",
      });
    }

    const existingCategory = await Category.findOne({
      categoryId: categoryId.trim(),
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category ID already exists",
      });
    }

    const category = await Category.create({
      categoryId: categoryId.trim(),
      name: name.trim(),
      icon: icon?.trim() || "Sparkles",
      sortOrder: Number(sortOrder) || 0,
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);

    return res.status(400).json({
      message: "Unable to create category",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId, name, icon, sortOrder } = req.body;

    const updateData = {};

    if (categoryId !== undefined) {
      updateData.categoryId = categoryId.trim().toLowerCase().replace(/\s+/g, "-");
    }

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (icon !== undefined) {
      updateData.icon = icon.trim();
    }

    if (sortOrder !== undefined) {
      updateData.sortOrder = Number(sortOrder);
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.json(category);
  } catch (error) {
    console.error("Update category error:", error);

    return res.status(400).json({
      message: "Unable to update category",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};