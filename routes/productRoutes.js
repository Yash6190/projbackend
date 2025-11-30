const express = require("express");
const router = express.Router();
const upload = require("../utils/multerConfig");

const productController = require("../controllers/productController");
const { verifyToken, verifyAdmin } = require("../utils/authMiddleware");

// ==============================
// PROTECTED (Admin only)
// ==============================
router.post(
  "/saveproduct",
  upload.array("pic", 10),     // 1️⃣ multer FIRST
  verifyToken,                 // 2️⃣ token check
  verifyAdmin,                 // 3️⃣ admin check
  productController.saveProduct
);

router.put(
  "/updateproduct/:id",
  upload.array("pic", 10),
  verifyToken,
  verifyAdmin,
  productController.updateProduct
);

router.delete(
  "/deleteproduct/:id",
  verifyToken,
  verifyAdmin,
  productController.deleteProduct
);

// ==============================
// PUBLIC ROUTES
// ==============================

// ✅ FIXED → Now supports category + subcategory
router.get("/getprodsbycate", productController.getProductsByCatAndSub);

router.get("/getproducts", productController.getProducts);

router.get("/getproddetailsbyidnew", productController.getProductDetailsByIdNew);

router.get("/searchproducts", productController.searchProducts);

router.get("/getlatestprods", productController.getLatestProducts);

module.exports = router;
