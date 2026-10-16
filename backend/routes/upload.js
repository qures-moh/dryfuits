const express = require('express');
const authMiddleware = require('../middleware/auth');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

router.post('/', authMiddleware, uploadController.uploadSingle, uploadController.uploadImage);
router.post('/multiple', authMiddleware, uploadController.uploadMultiple, uploadController.uploadMultipleImages);

module.exports = router;
