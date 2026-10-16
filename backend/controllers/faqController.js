const FAQ = require("../models/FAQ");

exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return res.json(faqs);
  } catch (error) {
    console.error("Get FAQs error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.createFaq = async (req, res) => {
  try {
    const { question, answer, sortOrder } = req.body;

    if (!question?.trim() || !answer?.trim()) {
      return res.status(400).json({
        message: "Question and answer are required",
      });
    }

    const faq = await FAQ.create({
      question: question.trim(),
      answer: answer.trim(),
      sortOrder: Number(sortOrder) || 0,
    });

    return res.status(201).json(faq);
  } catch (error) {
    console.error("Create FAQ error:", error);

    return res.status(400).json({
      message: "Unable to create FAQ",
    });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { question, answer, sortOrder } = req.body;

    const updateData = {};

    if (question !== undefined) {
      updateData.question = question.trim();
    }

    if (answer !== undefined) {
      updateData.answer = answer.trim();
    }

    if (sortOrder !== undefined) {
      updateData.sortOrder = Number(sortOrder);
    }

    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!faq) {
      return res.status(404).json({
        message: "FAQ not found",
      });
    }

    return res.json(faq);
  } catch (error) {
    console.error("Update FAQ error:", error);

    return res.status(400).json({
      message: "Unable to update FAQ",
    });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({
        message: "FAQ not found",
      });
    }

    return res.json({
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error("Delete FAQ error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};