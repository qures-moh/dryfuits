const mongoose = require("mongoose");
const Badge = require("../models/Badge");

/**
 * Automatically migrates any legacy string badges in the products collection
 * to valid Badge document ObjectId references so Mongoose populate never fails.
 */
async function migrateBadges() {
  try {
    const db = mongoose.connection.db;
    if (!db) return;

    const productsCollection = db.collection("products");
    const rawProducts = await productsCollection.find({}).toArray();

    let migratedCount = 0;

    for (const p of rawProducts) {
      if (typeof p.badge === "string") {
        const trimmed = p.badge.trim();

        if (!trimmed) {
          await productsCollection.updateOne(
            { _id: p._id },
            { $set: { badge: null } }
          );
          migratedCount++;
        } else if (!mongoose.Types.ObjectId.isValid(trimmed)) {
          // String name like "Best Seller", "Crunchy", etc.
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

          await productsCollection.updateOne(
            { _id: p._id },
            { $set: { badge: badgeDoc._id } }
          );
          migratedCount++;
        }
      }
    }

    if (migratedCount > 0) {
      console.log(
        `✅ Migrated ${migratedCount} product(s) with legacy string badges to Badge references.`
      );
    }
  } catch (error) {
    console.error("Badge migration warning:", error.message);
  }
}

module.exports = migrateBadges;
