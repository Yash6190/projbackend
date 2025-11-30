const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    address: String,
    pmode: String,
    carddetails: Object,
    username: String,
    billamt: Number,
    orderitems: [Object],
    status: String,
    orderDate: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

const Order = mongoose.model('Order', orderSchema, 'finalorder');
module.exports = Order;
