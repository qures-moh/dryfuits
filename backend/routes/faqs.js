const express = require('express');
const authMiddleware = require('../middleware/auth');
const faqController = require('../controllers/faqController');

const router = express.Router();

router.get('/', faqController.getAllFaqs);
router.post('/', authMiddleware, faqController.createFaq);
router.put('/:id', authMiddleware, faqController.updateFaq);
router.delete('/:id', authMiddleware, faqController.deleteFaq);

module.exports = router;
