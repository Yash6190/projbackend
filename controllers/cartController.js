const CartModel = require('../models/cartModel');

// Get all cart items for a user
exports.getCart = async (req, res) => {
  try {
    const { uname } = req.query;
    console.log(uname)
    if (!uname) 
        return res.send({ success: 0, message: "Username is required" });

    const items = await CartModel.find({username:uname});
    if (items.length === 0) return res.send({ success: 0 });
    res.send({ success: 1, cdata: items });
  } catch (e) {
    res.send({ success: -1, message: e.message });
  }
};

// Add product to cart
exports.saveToCart = async (req, res) => {
  try {
    const { pid, pname, rate, qty, totalcost, picname, username } = req.body;
    if (!pid) {
        console.log(pname)
      return res.send({ success: 0, message: "Missing required fields" });
      
    }
    const newItem = new CartModel({ pid, pname, rate, qty, totalcost, picname, username });
    await newItem.save();
    console.log(newItem)
    res.send({ success: 1, message: "Item added to cart" });
  } catch (e) {
    res.send({ success: -1, message: e.message });
  }
};

// Delete cart item by ID
exports.deleteFromCart = async (req, res) => {
  try {
    const result = await CartModel.deleteOne({ _id: req.params.id });
    res.send({ success: result.deletedCount === 1 ? 1 : 0 });
  } catch (e) {
    res.send({ success: -1, message: e.message });
  }
};
