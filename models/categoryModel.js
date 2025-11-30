const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({catname:String,picname:String},{versionKey:false});

module.exports = mongoose.model("category",CategorySchema,"category");//internal collection name, SchemaName, real collection name
