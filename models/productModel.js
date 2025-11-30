const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  catid: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
  subcatid: { type: mongoose.Schema.Types.ObjectId, ref: 'subcategory' },
  prodname: String,
  rate: Number,
  discount: Number,
  stock: Number,
  featured: String,
  description: String,
  picname: [String],
  addedon: { type: Date, default: Date.now },
  extImageNames: [String]
}, { versionKey: false });

module.exports = mongoose.model("product", ProductSchema, "product");
