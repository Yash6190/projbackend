const mongoose = require('mongoose');

const resetPassSchema = new mongoose.Schema({
  username: String,
  exptime: Date,
  token: String
}, { versionKey: false });

module.exports = mongoose.model("resetpass", resetPassSchema, "resetpass");
