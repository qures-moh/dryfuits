const express = require('express');
const authMiddleware = require('../middleware/auth');
const settingsController = require('../controllers/settingsController');

const router = express.Router();

router.get('/', settingsController.getSettings);
router.put('/', authMiddleware, settingsController.updateSettings);

module.exports = router;
