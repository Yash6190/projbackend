const Product = require('../models/productModel');

// ================================
// GET products by category
// ================================
exports.getProductsByCat = async (req, res) => {
  try {
    const { cid } = req.query;
    const pdata = await Product.find({ catid: cid });
    res.json({ success: pdata.length > 0 ? 1 : 0, pdata });
  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};

// ================================
// SAVE product (supports MULTIPLE images)
// multer.array("pic")
// ================================
// ================================
// SAVE product (supports MULTIPLE images)
// multer.array("pic")
// ================================
exports.saveProduct = async (req, res) => {
  try {
    const { pname, cid, scid, rate, dis, stock, feat, description } = req.body;

    if (!pname || !cid) {
      return res.json({ success: 0, message: "Product name & category required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.json({ success: 0, message: "At least 1 image required" });
    }

    const images = req.files.map(f => f.filename);

    const product = new Product({
      prodname: pname,
      picname: images,
      catid: cid,
      subcatid: scid || null,
      rate,
      discount: dis,
      stock,
      featured: feat,
      description,
      addedon: new Date(),
    });

    await product.save();

    return res.json({ success: 1 });
  } catch (err) {
    console.error("Save Product Error:", err);
    return res.json({
      success: -1,
      message: "Server error"
    });
  }
};

// ================================
// UPDATE product (supports MULTIPLE images)
// multer.array("pic")
// ================================
exports.updateProduct = async (req, res) => {
  try {
    const { pname, cid, scid, rate, dis, stock, feat, description } = req.body;

    if (!req.params.id) {
      return res.json({ success: 0, message: "Product ID missing" });
    }

    let updateData = {
      prodname: pname,
      catid: cid,
      subcatid: scid || null,
      rate,
      discount: dis,
      stock,
      featured: feat,
      description
    };

    // If NEW images uploaded → overwrite old ones
    if (req.files && req.files.length > 0) {
      updateData.picname = req.files.map(file => file.filename);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData);

    return res.json({
      success: updated ? 1 : 0,
      message: updated ? "Product updated successfully" : "Update failed"
    });

  } catch (err) {
    console.error("Update Product Error:", err.message);
    return res.json({
      success: -1,
      message: "Server error while updating product"
    });
  }
};

// ================================
// DELETE product
// ================================
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    res.json({ success: deleted ? 1 : 0 });
  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};

// ================================
// GET by CAT + optional SUBCAT
// ================================
// ================================
// GET products by CAT + optional SUBCAT
// ================================
exports.getProductsByCatAndSub = async (req, res) => {
  try {
    const { catid, subcatid } = req.query;

    if (!catid) return res.json({ success: 0, pdata: [] });

    let filter = { catid };

    if (subcatid) filter.subcatid = subcatid;

    const pdata = await Product.find(filter);

    res.json({ success: pdata.length > 0 ? 1 : 0, pdata });

  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};

// ================================
// Add Product direct
// ================================
exports.addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({ success: 1, message: "Product added successfully" });
  } catch (error) {
    res.json({ success: -1, message: "Error adding product" });
  }
};

// ================================
// GET ALL products (optional filters)
// ================================
exports.getProducts = async (req, res) => {
  const { cid, scid } = req.query;
  let filter = {};
  if (cid) filter.catid = cid;
  if (scid) filter.subcatid = scid;

  try {
    const products = await Product.find(filter);
    res.json({ success: products.length > 0 ? 1 : 0, pdata: products });
  } catch (err) {
    res.json({ success: -1, message: err.message });
  }
};

// ================================
// GET single product (Old)
// ================================
exports.getProductDetailsById = async (req, res) => {
  try {
    const result = await Product.findOne({ _id: req.query.prodid });
    if (!result) res.send({ success: 0 });
    else res.send({ success: 1, pdata: result });
  } catch (e) {
    res.send({ success: -1 });
  }
};

// ================================
// GET single product (New)
// ================================
exports.getProductDetailsByIdNew = async (req, res) => {
  try {
    const { prodid } = req.query;
    if (!prodid) return res.json({ success: 0, message: "Product ID required" });

    const pdata = await Product.findById(prodid);
    res.json({ success: pdata ? 1 : 0, pdata });

  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};

// ================================
// SEARCH
// ================================
exports.searchProducts = async (req, res) => {
  try {
    const result = await Product.find({
      prodname: { $regex: '.*' + req.query.q, $options: 'i' }
    });
    res.send({ success: result.length > 0 ? 1 : 0, pdata: result });
  } catch (e) {
    res.send({ success: -1 });
  }
};

// ================================
// LATEST products
// ================================
exports.getLatestProducts = async (req, res) => {
  try {
    const result = await Product.find().sort({ addedon: -1 }).limit(6);
    res.send({ success: result.length > 0 ? 1 : 0, pdata: result });
  } catch (e) {
    res.send({ success: -1 });
  }
};

// ================================
// FEATURED products
// ================================
exports.getFeaturedProducts = async (req, res) => {
  try {
    const result = await Product.find({ featured: "yes" })
      .sort({ addedon: -1 })
      .limit(6);
    res.send({ success: result.length > 0 ? 1 : 0, pdata: result });
  } catch (e) {
    res.send({ success: -1 });
  }
};
