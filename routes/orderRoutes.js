const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// ❗ IMPORTANT: Do NOT use /api here because server.js already uses: app.use('/api', orderRoutes);

router.post("/api/saveorder", orderController.saveOrder);
router.get("/api/getorderdetails", orderController.getLatestOrder);
router.get("/api/getallorders", orderController.getAllOrders);
router.get("/api/getuserorders", orderController.getUserOrders);
router.get("/api/fetchorderitems", orderController.getOrderItems);
router.put("/api/updatestatus", orderController.updateOrderStatus);
router.get("/api/orders", orderController.getFilteredOrders);

module.exports = router;
