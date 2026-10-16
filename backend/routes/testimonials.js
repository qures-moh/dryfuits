const express = require('express');
const authMiddleware = require('../middleware/auth');
const testimonialController = require('../controllers/testimonialController');

const router = express.Router();

router.get('/', testimonialController.getAllTestimonials);
router.post('/', authMiddleware, testimonialController.createTestimonial);
router.put('/:id', authMiddleware, testimonialController.updateTestimonial);
router.delete('/:id', authMiddleware, testimonialController.deleteTestimonial);

module.exports = router;
