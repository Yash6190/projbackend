const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
  name: String,
  phone: String,
  username: { type: String, unique: true },
  password: String,
  usertype: String,
  actstatus: Boolean,
  token: String,
  createdAt: { type: Date, default: Date.now, index: true }
}, { versionKey: false });

module.exports = mongoose.model("register", RegisterSchema, "register");
