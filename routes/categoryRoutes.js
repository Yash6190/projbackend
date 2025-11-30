const express = require('express');
const router = express.Router();

const upload = require('../utils/multerConfig');
const categoryController = require('../controllers/categoryController');
const { verifyToken, verifyAdmin } = require('../utils/authMiddleware'); // Import middleware

// Public routes
router.get('/getallcat', categoryController.getAllCategories);
router.get('/getcategory/:id', categoryController.getCategoryById);

// Protected routes (admin only)
router.post('/savecategory', verifyToken, verifyAdmin, upload.single('pic'), categoryController.addCategory);
router.put('/updatecategory', verifyToken, verifyAdmin, upload.single('pic'), categoryController.updateCategory);
router.delete('/deletecategory/:id', verifyToken, verifyAdmin, categoryController.deleteCategory);

module.exports = router;
