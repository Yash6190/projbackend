const SubCategoryModel = require('../models/subCategoryModel');
const fs = require('fs');

// Add SubCategory
exports.addSubCategory = async (req, res) => {
    try {
        let imagename = "defaultpic.jpg";
        if (req.file) imagename = req.file.filename;
        const newSubCat = new SubCategoryModel({
            catid: req.body.catid,
            subcatname: req.body.subcatname,
            picname: imagename
        });
        const result = await newSubCat.save();
        res.send({ success: result ? 1 : 0 });
    } catch (e) {
        console.log(e.message);
        res.send({ success: -1 });
    }
};

// Get subcategories by category id
exports.getSubCategoriesByCatId = async (req, res) => {
  try {
    const { catid } = req.query;
    if (!catid) {
      return res.status(400).json({ success: 0, message: "catid is required" });
    }

    const scdata = await SubCategoryModel.find({ catid });
    return res.json({ success: 1, scdata }); // 👈 return scdata (not subdata)
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    res.status(500).json({ success: 0, message: "Server error" });
  }
};

// Update SubCategory
exports.updateSubCategory = async (req, res) => {
    try {
        let imagename;
        if (req.file) {
            imagename = req.file.filename;
            if (req.body.oldpicname !== "defaultpic.jpg") {
                fs.unlinkSync(`${req.file.destination}/${req.body.oldpicname}`);
            }
        } else {
            imagename = req.body.oldpicname;
        }
        const result = await SubCategoryModel.updateOne(
            { _id: req.body.sid },
            { subcatname: req.body.subcatname, picname: imagename }
        );
        res.send({ success: result.modifiedCount === 1 ? 1 : 0 });
    } catch (e) {
        console.log(e.message);
        res.send({ success: -1 });
    }
};

// Delete SubCategory
exports.deleteSubCategory = async (req, res) => {
    try {
        const subcat = await SubCategoryModel.findById(req.params.id);
        if (!subcat) return res.send({ success: 0, message: "Subcategory not found" });
        if (subcat.picname !== "defaultpic.jpg") {
            fs.unlinkSync(`public/uploads/${subcat.picname}`);
        }
        const result = await SubCategoryModel.deleteOne({ _id: req.params.id });
        res.send({ success: result.deletedCount === 1 ? 1 : 0 });
    } catch (e) {
        console.log(e.message);
        res.send({ success: -1 });
    }
};
