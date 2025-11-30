const Order = require('../models/Order');
const Product = require('../models/productModel'); // assuming you have a product model
const CartModel = require('../models/cartModel');
// Save new order
exports.saveOrder = async (req, res) => {
  try {
    const { address, pmode, carddetails, username, billamt } = req.body;

    // Fetch cart items for user
    const items = await CartModel.find({ username: username });

        console.log(items)
    const newOrder = new Order({
      address,
      pmode,
      carddetails,
      username: username,
      billamt,
      orderitems: items,
      status: "Order Confirmed",
      orderDate: new Date()
    });

    const result = await newOrder.save();
    if (result) {
      // Update stock for each product
      for (const item of items) {
        await Product.updateOne({ _id: item.pid }, { $inc: { stock: -item.qty } });
      }
      // Clear cart
      await CartModel.deleteMany({ username: username });
      res.json({ success: 1 });
    } else {
      res.json({ success: 0 });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: -1 });
  }
};

// Get latest order for user
exports.getLatestOrder = async (req, res) => {
  try {
    const { un } = req.query;
    const order = await Order.findOne({ username: un }).sort({ orderDate: -1 });
    if (order) {
      res.json({ success: 1, odata: order });
    } else {
      res.json({ success: 0 });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: -1 });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json({ success: 1, odata: orders });
  } catch (e) {
    console.log(e);
    res.json({ success: -1 });
  }
};

// Get orders by user
exports.getUserOrders = async (req, res) => {
  try {
    const { un } = req.query;
    const orders = await Order.find({ username: un }).sort({ orderDate: -1 });
    if (orders.length > 0) {
      res.json({ success: 1, odata: orders });
    } else {
      res.json({ success: 0 });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: -1 });
  }
};

// Fetch order items
exports.getOrderItems = async (req, res) => {
  try {
    const { oid } = req.query;
    const order = await Order.findById(oid);
    if (order) {
      res.json({ success: 1, items: order.orderitems });
    } else {
      res.json({ success: 0 });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: -1 });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderid, newstatus } = req.body;
    const result = await Order.updateOne({ _id: orderid }, { status: newstatus });
    if (result.modifiedCount === 1) {
      res.json({ success: 1 });
    } else {
      res.json({ success: 0 });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: -1 });
  }
};

// Get orders with filters and pagination
exports.getFilteredOrders = async (req, res) => {
  try {
    const { day, pmode, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (day) {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      filter.orderDate = { $gte: dayStart, $lte: dayEnd };
    }
    if (pmode && pmode !== "all") {
      filter.pmode = new RegExp(pmode, "i");
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const totalOrders = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ orderDate: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({
      success: 1,
      odata: orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNumber),
      currentPage: pageNumber
    });
  } catch (e) {
    console.log(e);
    res.json({ success: -1 });
  }
};
