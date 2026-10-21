const express = require("express");

const {
  getBadges,
  getActiveBadges,
  createBadge,
  updateBadge,
  deleteBadge
} = require("../controllers/badgeController");

const adminMiddleware = require("../middleware/adminMiddleware");

const badgeRouter = express.Router();

badgeRouter.get("/", getActiveBadges);
badgeRouter.get("/admin",getBadges);
badgeRouter.post("/",  createBadge);
badgeRouter.put("/:id",  updateBadge);
badgeRouter.delete("/:id",  deleteBadge);

module.exports = badgeRouter;