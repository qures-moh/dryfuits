const express = require('express');
const authMiddleware = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.post('/', authMiddleware, categoryController.createCategory);
router.put('/:id', authMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;
