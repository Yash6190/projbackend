const mongoose = require('mongoose');

const subCatSchema = new mongoose.Schema({
    catid: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true },
    subcatname: String,
    picname: String
}, { versionKey: false });

module.exports = mongoose.model("subcategory", subCatSchema, "subcategory");
