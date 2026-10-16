const express = require("express");
const authMiddleware = require("../middleware/auth");
const customStudioController = require("../controllers/customStudioController");

const router = express.Router();

router.get("/", customStudioController.getStudioItems);
router.post("/", authMiddleware, customStudioController.createStudioItem);
router.put("/:id", authMiddleware, customStudioController.updateStudioItem);
router.delete("/:id", authMiddleware, customStudioController.deleteStudioItem);

module.exports = router;
