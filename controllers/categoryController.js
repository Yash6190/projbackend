const CategoryModel = require('../models/categoryModel');
const fs = require('fs');

exports.addCategory = async (req, res) => {
  try {
    let imagename = "defaultpic.jpg";

    if (req.file) {
      imagename = req.file.filename;
    }

    const newrecord = new CategoryModel({
      catname: req.body.catname,
      picname: imagename
    });

    const result = await newrecord.save();
    res.send({ success: result ? 1 : 0 });
  } catch (e) {
    console.log(e.message);
    res.send({ success: -1 });
  }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const result = await CategoryModel.find();
    
    if (result.length === 0) {
      res.send({ success: 0 });
    } else {
      res.send({ success: 1, cdata: result });
    }
  } catch (e) {
    res.send({ success: -1 });
    console.log(e.message);
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    let imagename;
    
    if (req.file) {
      // Admin wants to change the image
      imagename = req.file.filename;
      
      // Delete old image if it's not default
      if (req.body.oldpicname !== "defaultpic.jpg") {
        fs.unlinkSync(`${req.file.destination}/${req.body.oldpicname}`);
      }
    } else {
      // Keep old image
      imagename = req.body.oldpicname;
    }
    
    const result = await CategoryModel.updateOne(
      { _id: req.body.cid },
      { catname: req.body.catname, picname: imagename }
    );
    
    console.log(result);
    
    if (result.modifiedCount === 1) {
      res.send({ success: 1 });
    } else {
      res.send({ success: 0 });
    }
  } catch (e) {
    res.send({ success: -1 });
    console.log(e.message);
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    
    if (!category) {
      return res.send({ success: 0, message: "Category not found" });
    }
    
    // Delete image if it's not default
    if (category.picname !== "defaultpic.jpg") {
      fs.unlinkSync(`public/uploads/${category.picname}`);
    }
    
    const result = await CategoryModel.deleteOne({ _id: req.params.id });
    
    if (result.deletedCount === 1) {
      res.send({ success: 1 });
    } else {
      res.send({ success: 0 });
    }
  } catch (e) {
    res.send({ success: -1 });
    console.log(e.message);
  }
};

// Get Single Category
exports.getCategoryById = async (req, res) => {
  try {
    const result = await CategoryModel.findById(req.params.id);
    
    if (result) {
      res.send({ success: 1, cdata: result });
    } else {
      res.send({ success: 0, message: "Category not found" });
    }
  } catch (e) {
    res.send({ success: -1 });
    console.log(e.message);
  }
};