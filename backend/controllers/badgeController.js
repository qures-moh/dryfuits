const Badge = require("../models/Badge");

const getBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      badges
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch badges",
      error: error.message
    });
  }
};

const getActiveBadges = async (req, res) => {
  try {
    const badges = await Badge.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      badges
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active badges",
      error: error.message
    });
  }
};

const createBadge = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Badge name is required"
      });
    }

    const existingBadge = await Badge.findOne({
      name: name.trim()
    });

    if (existingBadge) {
      return res.status(409).json({
        success: false,
        message: "Badge already exists"
      });
    }

    const badge = await Badge.create({
      name: name.trim()
    });

    res.status(201).json({
      success: true,
      message: "Badge created successfully",
      badge
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create badge",
      error: error.message
    });
  }
};

const updateBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const badge = await Badge.findById(id);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found"
      });
    }

    if (name !== undefined) {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          message: "Badge name is required"
        });
      }

      const existingBadge = await Badge.findOne({
        name: trimmedName,
        _id: { $ne: id }
      });

      if (existingBadge) {
        return res.status(409).json({
          success: false,
          message: "Badge already exists"
        });
      }

      badge.name = trimmedName;
    }

    if (isActive !== undefined) {
      badge.isActive = isActive;
    }

    await badge.save();

    res.status(200).json({
      success: true,
      message: "Badge updated successfully",
      badge
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update badge",
      error: error.message
    });
  }
};

const deleteBadge = async (req, res) => {
  try {
    const { id } = req.params;

    const badge = await Badge.findById(id);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found"
      });
    }

    await Badge.findByIdAndDelete(id);

    const Product = require("../models/Product");
    await Product.updateMany({ badge: id }, { $set: { badge: null } });

    res.status(200).json({
      success: true,
      message: "Badge deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete badge",
      error: error.message
    });
  }
};

module.exports = {
  getBadges,
  getActiveBadges,
  createBadge,
  updateBadge,
  deleteBadge
};