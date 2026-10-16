const Testimonial = require("../models/Testimonial");

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return res.json(testimonials);
  } catch (error) {
    console.error("Get testimonials error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const {
      name,
      role,
      rating,
      comment,
      date,
      verified,
      sortOrder,
    } = req.body;

    if (!name?.trim() || !comment?.trim()) {
      return res.status(400).json({
        message: "Name and comment are required",
      });
    }

    const testimonial = await Testimonial.create({
      name: name.trim(),
      role: role?.trim() || "",
      rating: rating !== undefined ? Number(rating) : 5,
      comment: comment.trim(),
      date: date?.trim() || "Recently",
      verified:
        verified !== undefined ? Boolean(verified) : true,
      sortOrder:
        sortOrder !== undefined ? Number(sortOrder) : 0,
    });

    return res.status(201).json(testimonial);
  } catch (error) {
    console.error("Create testimonial error:", error);

    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "role",
      "rating",
      "comment",
      "date",
      "verified",
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

    if (updateData.role !== undefined) {
      updateData.role = String(updateData.role).trim();
    }

    if (updateData.comment !== undefined) {
      updateData.comment = String(updateData.comment).trim();
    }

    if (updateData.rating !== undefined) {
      updateData.rating = Number(updateData.rating);
    }

    if (updateData.sortOrder !== undefined) {
      updateData.sortOrder = Number(updateData.sortOrder);
    }

    const testimonial =
      await Testimonial.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!testimonial) {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    return res.json(testimonial);
  } catch (error) {
    console.error("Update testimonial error:", error);

    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial =
      await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    return res.json({
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Delete testimonial error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};