const SiteSettings = require("../models/SiteSettings");

exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne().lean();

    if (!settings) {
      settings = await SiteSettings.create({});
      settings = settings.toObject();
    }

    return res.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const allowedFields = [
      "heroTitle",
      "heroDescription",
      "heroBadgeText",
      "heroImage",
      "heroFloatingBadge1Title",
      "heroFloatingBadge1Subtitle",
      "heroFloatingBadge2Title",
      "heroFloatingBadge2Subtitle",
      "announcementText",
      "announcementDelivery",
      "announcementWhatsApp",
      "brandName",
      "brandTagline",
      "logoUrl",
      "whatsappNumber",
      "phoneNumber",
      "email",
      "footerDescription",
      "footerBottomText",
      "collectionTitle",
      "collectionSubtitle",
      "collectionDescription",
      "bucketBannerTitle",
      "bucketBannerDescription",
      "bucketBannerImage",
      "healthSectionTitle",
      "healthSectionSubtitle",
      "healthSectionDescription",
      "reviewsSectionTitle",
      "reviewsSectionSubtitle",
      "reviewsSectionDescription",
      "contactSectionTitle",
      "contactSectionSubtitle",
      "contactSectionDescription",
      "freeShippingThreshold",
      "shippingFee",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const settings = await SiteSettings.findOneAndUpdate(
      {},
      {
        $set: updateData,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json(settings);
  } catch (error) {
    console.error("Update settings error:", error);

    return res.status(400).json({
      message: error.message,
    });
  }
};