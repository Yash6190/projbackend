const express = require('express');
const router = express.Router();

const subCatController = require('../controllers/subCategoryController');
const upload = require('../utils/multerConfig'); // Make sure this exports configured multer instance
const { verifyToken, verifyAdmin } = require('../utils/authMiddleware'); // Import middleware

// Get subcategories by category id (catid query param)
router.get('/getsubcatsbycat', subCatController.getSubCategoriesByCatId);

// Add subcategory with image upload
router.post('/savesubcategory', upload.single('pic'),verifyToken, verifyAdmin, subCatController.addSubCategory);

// Update subcategory with optional image upload
router.put('/updatesubcategory', upload.single('pic'), verifyToken, verifyAdmin, subCatController.updateSubCategory);

// Delete subcategory by id URL param
router.delete('/delsubcategory/:id', verifyToken, verifyAdmin,subCatController.deleteSubCategory);

module.exports = router;
