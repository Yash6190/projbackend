const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  pid: String,
  pname: String,
  rate: Number,
  qty: Number,
  totalcost: Number,
  picname: String,
  username: String
}, { versionKey: false });

module.exports = mongoose.model("cart", CartSchema, "cart");
