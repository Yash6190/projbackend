const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = 9000;

app.use(cookieParser());
// Middlewares
app.use(cors({
  origin: "https://projfrontend-98eb.onrender.com",   // your React origin
  credentials: true,                 // allow sending cookies
}));

app.use(express.json());

// Routes
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes'); // path to your routes file
// or, if prefixed:
// app.use('/api', orderRoutes);  then orderRoutes paths should not have '/api' prefix internally
const contactRoutes = require('./routes/contactRoutes');

//Apis

app.use('/api', categoryRoutes);
app.use('/api', subCategoryRoutes);
app.use('/api', authRoutes);

app.use('/api', passwordRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', require('./routes/userRoutes'));
//Password reset
app.use('/api', passwordRoutes);
//Category APIs
app.use('/api',categoryRoutes);
//Subcategory APIs
app.use('/api', subCategoryRoutes);
//Product APIs
app.use('/api', productRoutes);

app.use(orderRoutes); // no prefix, routes inside have full api/ paths
app.use('/api',contactRoutes);




// function verifyToken(req, res, next) {
//   const token = req.cookies.jtoken; // ✅ read cookie

//   if (!token) {
//     return res.status(401).json({ success: 0, message: "No token provided" });
//   }

//   try {
//     const payload = jwt.verify(token, process.env.JWT_KEY);
//     req.utype = payload.role;
//     req.userId = payload.id;
//     next();
//   } catch (err) {
//     return res.status(403).json({ success: 0, message: "Invalid token" });
//   }
// }

// app.post("/api/refresh", (req, res) => {
//   const refreshToken = req.cookies.rftoken;

//   if (!refreshToken) {
//     return res.status(401).json({ success: 0, message: "No refresh token provided" });
//   }

//   try {
//     const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

//     // Create new access token
//     const newAccessToken = jwt.sign(
//       { id: payload.id, role: payload.role },
//       process.env.JWT_KEY,
//       { expiresIn: "15m" }
//     );

//     res.cookie("jtoken", newAccessToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       maxAge: 15 * 60 * 1000
//     });

//     return res.json({ success: 1, message: "Token refreshed" });
//   } catch (err) {
//     return res.status(403).json({ success: 0, message: "Invalid refresh token" });
//   }
// });


// function verifyadmin(req,res,next)
// {
//   if(req.utype === "admin")
//   {
//     next();
//   }
//   else{
//     return res.status(401).send({success:-2})
//   }

// }



// mongoose.connect('mongodb://127.0.0.1:27017/ecomdb')//here ecomdb is the name of your database in the backend
mongoose.connect('mongodb+srv://projectdbuser:GCXm6G9pAy1xYmEn@cluster0.gx7l4el.mongodb.net/projdb?appName=Cluster0')//here ecomdb is the name of your database in the backend
  .then(() => console.log('MongoDB Connected!')).catch((e)=>console.log("Unable to connect to MongoDB " + e.message));







// const RegisterSchema = mongoose.Schema({name: String, phone: String, username:{unique:true,type:String}, password:String, usertype:String, actstatus:Boolean, token:String,  createdAt: { type: Date, default: Date.now, index: true }},{versionKey:false});
// //schema defines the structure of the collection/table in database. means the name of columns and its datatype

// const RegisterModel = mongoose.model("register",RegisterSchema,"register");//internal collection name, SchemaName, real collection name



// app.post("/api/register", async (req, res) => {
//   try {
//     // Unpack data from the request body
//     const { pname, phone, uname, pass, captcha } = req.body;

//  const captchaVerify = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`
//     );
//      if (!captchaVerify.data.success) {
//       return res.status(400).send({ success: 0, message: "Captcha failed" });
//     }
//     // Generate activation token and hash the password
//     const acttoken = uuidv4();
//     console.log(acttoken)
//     const hashedPassword = await bcrypt.hash(pass, 10);

//     // Create the user record
//     const newrecord = new RegisterModel({
//       name: pname,
//       phone: phone,
//       username: uname,
    
//       password: hashedPassword,
//       usertype: "normal",
//       actstatus: false,
//       token: acttoken,
//     });

//     // Save to the database
//     const result = await newrecord.save();
//     if (result) {
//       const mailOptions = {
//         from: 'no-reply@demomailtrap.co',
//         to:uname,
//         subject: `Activate your SuperMarket account`,
//         html: `
//           <h3>Activate your SuperMarket account</h3>
//           <p>Hi ${pname},</p>
//           <p>Thanks for signing up. Please activate your account by clicking the link below:</p>
//           <a href="http://localhost:3000/activate?code=${acttoken}">Activate Account</a>
//         `,
//       };

//       await transporter.sendMail(mailOptions);
//       res.status(200).json({ success: true, message: 'Registration successful, email sent.' });

//     } else {
//       res.status(500).json({ success: false, message: 'Could not save user.' });
//     }
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//     console.log(e.message);
//   }
// });
// app.put("/api/activate", async (req, res) => {
//   try {
//     const { code } = req.body;
//     if (!code) {
//       return res.send({ success: 0, message: "Activation code is missing." });
//     }
//     const user = await RegisterModel.findOne({ token: code });
//     if (!user) {
//       return res.send({ success: 0, message: "Invalid or expired activation code." });
//     }
//     const now = new Date();
//     const expiry = new Date(user.createdAt.getTime() + 15 * 60000); // 15 minutes
//     if (user.actstatus === false && now > expiry) {
//       await RegisterModel.deleteOne({ token: code, actstatus: false });
//       return res.send({ success: 0, message: "Activation code has expired. Account deleted." });
//     }
//     if (user.actstatus === false) {
//       await RegisterModel.updateOne({ token: code }, { actstatus: true });
//       return res.send({ success: 1 });
//     } else {
//       return res.send({ success: 0, message: "Account already activated." });
//     }
//   } catch (e) {
//     res.send({ success: -1, message: "Server error: " + e.message });
//   }
// });






// app.post("/api/login", async (req, res) => {
//   try {
//     const { uname, pass,captcha } = req.body;
//     const captchaVerify = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`
//     );
    
//     if (!captchaVerify.data.success) {
//       return res.status(400).send({ success: 0, message: "Captcha failed" });
//     }
    
//     const result = await RegisterModel.findOne({ username: uname });

//     if (!result) return res.send({ success: 0 });

//     const passwordMatch = await bcrypt.compare(pass, result.password);
//     if (!passwordMatch) return res.send({ success: 0 });

//     // Access Token (short-lived)
//     const accessToken = jwt.sign(
//       { id: result._id, role: result.usertype },
//       process.env.JWT_KEY,
//       { expiresIn: "15m" } // shorter lifetime
//     );

//     // Refresh Token (long-lived)
//     const refreshToken = jwt.sign(
//       { id: result._id, role: result.usertype },
//       process.env.JWT_REFRESH_KEY, // different secret!
//       { expiresIn: "7d" }
//     );

//     // Store tokens in cookies
//     res.cookie("jtoken", accessToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       maxAge: 15 * 60 * 1000 // 15 minutes
//     });

//     res.cookie("rftoken", refreshToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//     });

//     const respdata = {
//       _id: result._id,
//       name: result.name,
//       username: result.username,
//       usertype: result.usertype,
//       actstatus: result.actstatus
//     };

//     return res.send({ success: 1, udata: respdata });

//   } catch (e) {
//     console.log(e.message);
//     return res.send({ success: -1 });
//   }
// });
// app.get("/api/getallusers", async (req, res) => {
//   try {
//     const result = await RegisterModel.find();
//     if (result.length === 0) {
//       res.send({ success: 0 });
//     } else {
//       res.send({ success: 1, udata: result });
//     }
//   } catch (e) {
//     res.send({ success: -1 });
//     console.log(e.message);
//   }
// });

// // protect delete route
// app.delete("/api/deluser/:uid", async (req, res) => {
//   try {
//     const del = await RegisterModel.findByIdAndDelete(req.params.uid);
//     if (del) {
//       res.send({ success: 1 });
//     } else {
//       res.send({ success: 0 });
//     }
//   } catch (e) {
//     res.send({ success: -1 });
//     console.log(e.message);
//   }
// });


// app.put("/api/changepassword",async(req,res)=>
// {
//   try
//   {
//     const result = await RegisterModel.updateOne({username:req.body.uname,password:req.body.cpass},{password:req.body.newpass})
//     console.log(result)
//     if(result.modifiedCount===1)
//     {
//       res.send({success:1})
//     }
//     else
//     {
//       res.send({success:0})
//     }
//   }
//   catch(e)
//   {
//    res.send({success:-1})
//   }
// })


// const resetPassSchema = new mongoose.Schema({username:String,exptime:Date,token:String},{versionKey:false})

// const restPassModel = mongoose.model("resetpass",resetPassSchema,"resetpass")

// app.get("/api/forgotpassword", async (req, res) => {
//   const passtoken = uuidv4();
//   const exptm = new Date(Date.now() + 15 * 60 * 1000); // expires in 15 mins

//   try {
//     const result = await RegisterModel.findOne({ username: req.query.un });
//     if (!result) {
//       return res.send({ success: 3 }); // Invalid username
//     }

//     // delete old reset tokens
//     await restPassModel.deleteMany({ username: req.query.un });

//     const newrecord = new restPassModel({
//       username: req.query.un,
//       exptime: exptm,
//       token: passtoken
//     });

//     const result2 = await newrecord.save();
//     if (!result2) {
//       return res.send({ success: 0 });
//     }

//     const mailOptions = {
//       from: "no-reply@demomailtrap.co",
//       to: req.query.un,
//       subject: "Reset Password Mail from SuperMarket.com",
//       html: `Dear ${result.username},<br/><br/>
//              Click on the following link to reset your password:<br/><br/>
//              <a href='http://localhost:3000/resetpassword?code=${passtoken}'>
//                Reset Password
//              </a><br/><br/>
//              This link will expire in 15 minutes.`
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log(error);
//         res.send({ success: 2 });
//       } else {
//         console.log("Email sent: " + info.response);
//         res.send({ success: 1 });
//       }
//     });
//   } catch (e) {
//     console.log(e.message);
//     res.send({ success: -1 });
//   }
// });

// app.post("/api/resetpassword",async (req, res) => {
//   try {
//     const { token, newpass } = req.body;

//     // 1. Look for token in resetpass collection
//     const resetRecord = await restPassModel.findOne({ token });
//     if (!resetRecord) {
//       return res.send({ success: 0, message: "Invalid reset link" });
//     }

//     // 2. Check expiry
//     if (resetRecord.exptime < Date.now()) {
//       return res.send({ success: 2, message: "Reset link expired" });
//     }

//     // 3. Find the user by username
//     const user = await RegisterModel.findOne({ username: resetRecord.username });
//     if (!user) {
//       return res.send({ success: 0, message: "User not found" });
//     }

//     // 4. Hash new password
//     const hashedPassword = await bcrypt.hash(newpass, 10);

//     // 5. Update user password
//     user.password = hashedPassword;
//     await user.save();

//     // 6. Remove reset token (so it can't be reused)
//     await restPassModel.deleteOne({ token });

//     res.send({ success: 1, message: "Password reset successfully" });
//   } catch (err) {
//     console.error(err);
//     res.send({ success: -1, message: "Server error" });
//   }
// });

// // ================== PRODUCT ROUTES ==================

// // Get products by category

// app.get("/api/getprodsbycat", async (req, res) => {
//     try {
//         const { cid } = req.query;
//         const pdata = await Product.find({ catid: cid });
//         res.json({ success: pdata.length > 0 ? 1 : 0, pdata });
//     } catch (err) {
//         res.status(500).json({ success: 0, message: err.message });
//     }
// });

// // // Save product
// // app.post("/api/saveproduct", upload.single("pic"), async (req, res) => {
// //     try {
// //         const { pname, cid, scid, rate, dis, stock, feat, description } = req.body;
// //         if (!req.file) return res.json({ success: 0, message: "Image required" });

// //         const product = new Product({
// //             prodname: pname,
// //             picname: req.file.filename,
// //             catid: cid,
// //             subcatid: scid || null,
// //             rate,
// //             discount: dis,
// //             stock,
// //             featured: feat,
// //             description
// //         });
// //         await product.save();
// //         res.json({ success: 1 });
// //     } catch (err) {
// //         res.status(500).json({ success: 0, message: err.message });
// //     }
// // });

// // // Update product
// // app.put("/api/updateproduct/:id", upload.single("pic"), async (req, res) => {
// //     try {
// //         const { pname, cid, scid, rate, dis, stock, feat, description } = req.body;
// //         const updateData = {
// //             prodname: pname,
// //             catid: cid,
// //             subcatid: scid || null,
// //             rate,
// //             discount: dis,
// //             stock,
// //             featured: feat,
// //             description
// //         };
// //         if (req.file) updateData.picname = req.file.filename;

// //         const updated = await Product.findByIdAndUpdate(req.params.id, updateData);
// //         res.json({ success: updated ? 1 : 0 });
// //     } catch (err) {
// //         res.status(500).json({ success: 0, message: err.message });
// //     }
// // });

// // Delete product
// app.delete("/api/deleteproduct/:id", async (req, res) => {
//     try {
//         const deleted = await Product.findByIdAndDelete(req.params.id);
//         res.json({ success: deleted ? 1 : 0 });
//     } catch (err) {
//         res.status(500).json({ success: 0, message: err.message });
//     }
// });

// // Get products by category (and optionally subcategory)
// app.get("/api/getprodsbycate", async (req, res) => {
//     try {
//         const { catid, subcatid } = req.query;
//         if (!catid) return res.json({ success: 0, pdata: [] });

//         let query = { catid };
//         if (subcatid) query.subcatid = subcatid;

//         const pdata = await Product.find(query);
//         res.json({ success: pdata.length > 0 ? 1 : 0, pdata });
//     } catch (err) {
//         res.status(500).json({ success: 0, message: err.message });
//     }
// });



// // ====== API to Add Product ======
// app.post("/api/addproduct", async (req, res) => {
//     try {
//         const newProduct = new Product(req.body);
//         await newProduct.save();
//         res.json({ success: 1, message: "Product added successfully" });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: -1, message: "Error adding product" });
//     }
// });

// // ====== API to Delete Product ======
// app.delete("/api/deleteproduct/:id", async (req, res) => {
//     try {
//         await Product.findByIdAndDelete(req.params.id);
//         res.json({ success: 1, message: "Product deleted successfully" });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: -1, message: "Error deleting product" });
//     }
// });


// // Get Products by Category

// app.get("/api/getproducts", async (req, res) => {
//     const { cid, scid } = req.query;
//     let filter = {};

//     if (cid) filter.catid = cid;
//     if (scid) filter.subcatid = scid;

//     try {
//         const products = await Product.find(filter);
//         if (products.length > 0) {
//             res.json({ success: 1, pdata: products });
//         } else {
//             res.json({ success: 0 });
//         }
//     } catch (err) {
//         res.json({ success: -1, message: err.message });
//     }
// });

// //Get by category and subcategory

// app.get("/api/getallcatwithsubcat", async (req, res) => {
//     try {
//         // Get all categories
//         const categories = await CategoryModel.find({});

//         // Get all subcategories
//         const subcategories = await SubCategoryModel.find({});

//         // Merge subcategories into their respective categories
//         const merged = categories.map(cat => {
//             return {
//                 ...cat._doc, // Mongoose document to plain object
//                 subcategories: subcategories.filter(sub => sub.catid.toString() === cat._id.toString())
//             };
//         });

//         if (merged.length > 0) {
//             res.json({ success: 1, cdata: merged });
//         } else {
//             res.json({ success: 0, cdata: [] });
//         }
//     } catch (err) {
//         console.error(err);
//         res.json({ success: -1, message: "Error occurred", error: err.message });
//     }
// });

// app.get("/api/getprodsbycat", async (req, res) => {
//     try {
//         const result = await Product.find({ catid: req.query.cid });
//         if (result.length === 0) res.send({ success: 0 });
//         else res.send({ success: 1, pdata: result });
//     } catch (e) {
//         res.send({ success: -1 });
//         console.log(e.message);
//     }
// });

// // Get Product Details by ID
// app.get("/api/getproddetailsbyid", async (req, res) => {
//     try {
//         const result = await Product.findOne({ _id: req.query.prodid });
//         if (!result) res.send({ success: 0 });
//         else res.send({ success: 1, pdata: result });
//     } catch (e) {
//         res.send({ success: -1 });
//         console.log(e.message);
//     }
// });

// // Search Products
// app.get("/api/searchproducts", async (req, res) => {
//     try {
//         const result = await Product.find({
//             prodname: { $regex: '.*' + req.query.q, $options: 'i' }
//         });
//         if (result.length > 0) res.send({ success: 1, pdata: result });
//         else res.send({ success: 0 });
//     } catch (e) {
//         res.send({ success: -1 });
//         console.log(e.message);
//     }
// });

// // // Update Product
// // app.put("/api/updateproduct/:id", upload.single('pic'), async (req, res) => {
// //     try {
// //         const product = await Product.findById(req.params.id);
// //         if (!product) return res.send({ success: 0 });

// //         let imagename = product.picname;
// //         if (req.file) imagename = req.file.filename;

// //         product.catid = req.body.cid;
// //         product.prodname = req.body.pname;
// //         product.rate = req.body.rate;
// //         product.discount = req.body.dis;
// //         product.stock = req.body.stock;
// //         product.featured = req.body.feat;
// //         product.description = req.body.description;
// //         product.picname = imagename;

// //         await product.save();
// //         res.send({ success: 1 });
// //     } catch (e) {
// //         res.send({ success: -1 });
// //         console.log(e.message);
// //     }
// // });

// // Delete Product
// app.delete("/api/deleteproduct/:id", async (req, res) => {
//     try {
//         const result = await Product.deleteOne({ _id: req.params.id });
//         res.send({ success: result.deletedCount > 0 ? 1 : 0 });
//     } catch (e) {
//         res.send({ success: -1 });
//         console.log(e.message);
//     }
// });
// app.get("/api/searchproducts",async(req,res)=>
// {
//     try
//     {
//       const result = await Product.find({prodname: { $regex: '.*' + req.query.q ,$options:'i' }})
//       if(result.length>0)
//       {
//         res.send({success:1,pdata:result})
//       }
//       else
//       {
//         res.send({success:0})
//       }
//     }
//     catch(e)
//     {
//       res.send({success:-1})
//       console.log(e.message)
//     }
// })


// app.get("/api/getlatestprods",async(req,res)=>
// {
//     try
//     {
//       const result = await Product.find().sort({"addedon":-1}).limit(6)
//       if(result.length===0)
//       {
//         res.send({success:0})
//       }
//       else
//       {
//         res.send({success:1,pdata:result})
//       }
//     }
//     catch(e)
//     {
//       res.send({success:-1})
//       console.log(e.message)
//     }
// })

// app.get("/api/getfeaturedprods",async(req,res)=>
// {
//     try
//     {
//       const result = await Product.find({"featured":"yes"}).sort({"addedon":-1}).limit(6)
//       if(result.length===0)
//       {
//         res.send({success:0})
//       }
//       else
//       {
//         res.send({success:1,pdata:result})
//       }
//     }
//     catch(e)
//     {
//       res.send({success:-1})
//       console.log(e.message)
//     }
// })

// const ProductSchema = mongoose.Schema({catid:{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }, subcatid:{ type: mongoose.Schema.Types.ObjectId, ref: 'subcategory' }, prodname:String,rate:Number,discount:Number,stock:Number,featured:String,description:String,picname:String,addedon:Date,extImageNames:[String]},{versionKey:false});

// const Product = mongoose.model("product",ProductSchema,"product");//internal collection name, SchemaName, real collection name

// // ================== PRODUCT DETAILS BY ID ==================
// app.get("/api/getproddetailsbyidnew", async (req, res) => {
//     try {
//         const { prodid } = req.query;
//         if (!prodid) return res.json({ success: 0, message: "Product ID required" });
        
//         const pdata = await Product.findById(prodid);
//         if (pdata) {
//             res.json({ success: 1, pdata });
//         } else {
//             res.json({ success: 0, pdata: null });
//         }
//     } catch (err) {
//         res.status(500).json({ success: 0, message: err.message });
//     }
// });
//Cart APIs


// const CartSchema = mongoose.Schema({pid:String,pname:String,rate:Number,qty:Number,totalcost:Number,picname:String,username:String},{versionKey:false});

// const CartModel = mongoose.model("cart",CartSchema,"cart");//internal collection name, SchemaName, real collection name
// // app.put('/api/updatecat/:catid', upload.single('pic'), async (req, res) => {
// //   try {
// //     const urecord = await CategoryModel.findOne({ _id: req.params.catid });
// //     if (!urecord) return res.send({ success: 0 });

// //     urecord.catname = req.body.catname;
// //     if (req.file) {
// //       urecord.picname = req.file.filename;
// //     }

// //     await urecord.save();
// //     res.send({ success: 1 });
// //   } catch (e) {
// //     console.log(e.message);
// //     res.send({ success: -1 });
// //   }
// // });

    
//     // Get product details by ID
// app.get("/api/getproddetailsbyid", async (req, res) => {
//   try {
//     const { prodid } = req.query;
//     if (!prodid) {
//       return res.send({ success: 0 });
//     }

//     const product = await Product.findById(prodid);
//     if (!product) {
//       return res.send({ success: 0 });
//     }

//     res.send({ success: 1, pdata: product });
//   } catch (e) {
//     console.log(e.message);
//     res.send({ success: -1 });
//   }
// });

// // Save product to cart
// app.post("/api/savetocart", async (req, res) => {
//   try {
//     const { pid, prodname, remcost, qty, tc, picname, uname } = req.body;

//     if (!pid || !uname || !qty) {
//       return res.send({ success: 0 });
//     }

//     // Create cart record based on your CartSchema
//     const newrecord = new CartModel({
//       pid,
//       pname: prodname,         // mapping frontend prodname to pname
//       rate: remcost,           // remcost is final discounted rate
//       qty,
//       totalcost: tc,           // total cost calculated in frontend
//       picname,
//       username: uname
//     });

//     const result = await newrecord.save();
//     if (result) {
//       res.send({ success: 1 });
//     } else {
//       res.send({ success: 0 });
//     }

//   } catch (e) {
//     console.log(e.message);
//     res.send({ success: -1 });
//   }
// });

 
// app.delete("/api/delcat/:id",async(req,res)=>
// {
//     try
//     {
//       const result = await CategoryModel.deleteOne({_id:req.params.id})
//       if(result.deletedCount===1)
//       {
//         res.send({success:1})
//       }
//       else
//       {
//         res.send({success:0})
//       }
//     }
//     catch(e)
//     {
//       res.send({success:-1})
//       console.log(e.message)
//     }
// })

// app.get("/api/getallcat",async(req,res)=>
// {
//     try
//     {
//       const result = await CategoryModel.find()
//       if(result.length===0)
//       {
//         res.send({success:0})
//       }
//       else
//       {
//         res.send({success:1,cdata:result})
//       }
//     }
//     catch(e)
//     {
//       res.send({success:-1})
//       console.log(e.message)
//     }
// })
//   app.get("/api/getproddetailsbyid", async (req, res) => {
//     try {
//         const { prodid } = req.query;
//         if (!prodid) {
//             return res.json({ success: 0, message: "Product ID required" });
//         }

//         const product = await Product.findById(prodid);
//         if (!product) {
//             return res.json({ success: 0, message: "Product not found" });
//         }

//         res.json({ success: 1, pdata: product });
//     } catch (err) {
//         res.json({ success: -1, message: err.message });
//     }
// });

// // 2. POST save to cart
// app.post("/api/savetocart", async (req, res) => {
//     try {
//         const { pid, prodname, remcost, qty, tc, picname, uname } = req.body;

//         if (!pid || !uname || !qty) {
//             return res.json({ success: 0, message: "Missing required fields" });
//         }

//         const newCartItem = new Cart({
//             pid,
//             prodname,
//             remcost,
//             qty,
//             tc,
//             picname,
//             uname
//         });

//         await newCartItem.save();
//         res.json({ success: 1, message: "Item added to cart" });
//     } catch (err) {
//         res.json({ success: -1, message: err.message });
//     }
// });
// // 1. Get all cart items by username
// app.get("/api/getcart", async (req, res) => {
//   try {
//     const { uname } = req.query;
//     if (!uname) {
//       return res.send({ success: 0 });
//     }

//     const result = await CartModel.find({ username: uname });
//     if (result.length === 0) {
//       res.send({ success: 0 });
//     } else {
//       res.send({ success: 1, cdata: result });
//     }
//   } catch (e) {
//     console.log(e.message);
//     res.send({ success: -1 });
//   }
// });

// // 2. Delete from cart by ID
// app.delete("/api/delfromcart/:id", async (req, res) => {
//   try {
//     const result = await CartModel.deleteOne({ _id: req.params.id });
//     if (result.deletedCount === 1) {
//       res.send({ success: 1 });
//     } else {
//       res.send({ success: 0 });
//     }
//   } catch (e) {
//     console.log(e.message);
//     res.send({ success: -1 });
//   }
// });

// const orderSchema = new mongoose.Schema({address:String,pmode:String,carddetails:Object,username:String,billamt:Number,orderitems:[Object],status:String,orderDate:Date},{versionKey:false})

// const orderModel = mongoose.model("finalorder",orderSchema,"finalorder")

// app.post('/api/saveorder', async(req, res)=>
// {
//   try
//   {
//     const items = await CartModel.find({username:req.body.uname})

//     const newrecord = orderModel({address:req.body.addr,pmode:req.body.pmode,carddetails:req.body.cardetails,username:req.body.uname,billamt:req.body.billamt,orderitems:items,status:"Order Confirmed",orderDate:new Date()})

//     const result = await newrecord.save();//saving document to real collection
//     if(result)
//     {
//         for(var x=0;x<items.length;x++)
//         {
//           const updateresult = await Product.updateOne({_id:items[x].pid},{$inc:{"stock":-items[x].qty}})
//         }
//         const delresult = await CartModel.deleteMany({username:req.body.uname})
//         res.send({success:1})
//     }
//     else
//     {
//       res.send({success:0})
//     }
//   }
//   catch(e)
//   {
//     res.send({success:-1})
//     console.log(e.message)
//   }
// })


// app.get("/api/getorderdetails",async(req,res)=>
// {
//     try
//     {
//       const result = await orderModel.findOne({username:req.query.un}).sort({"orderDate":-1})
//       if(result)
//       {
//         res.send({success:1,odata:result})
//       }
//       else
//       {
//         res.send({success:0})
//       }
//     }
//     catch(e)
//     {
//       res.send({success:-1})
//       console.log(e.message)
//     }
// })

// app.get("/api/getallorders",async(req,res)=>
// {
//     try
//     {
//       const result = await orderModel.find().sort({"orderDate":-1})
//       if(result.length>0)
//       {
//         res.send({success:1,odata:result})
//       }
//       else
//       {
//         res.send({success:0})
//       }
//     }
//     catch(e)
//     {
//       res.send({success:-1})
//       console.log(e.message)
//     }
// })

// app.get("/api/getuserorders",async(req,res)=>
// {
//     try
//     {
//       const result = await orderModel.find({username:req.query.uname}).sort({"orderDate":-1})
//       if(result.length>0)
//       {
//         res.send({success:1,odata:result})
//       }
//       else
//       {
//         res.send({success:0})
//       }
//     }
//     catch(e)
//     {
//       res.send({success:-1})
//       console.log(e.message)
//     }
// })

// app.get("/api/fetchorderitems",async(req,res)=>
// {
//     try
//     {
//       const result = await orderModel.findOne({_id:req.query.oid})
//       if(result)
//       {
//         res.send({success:1,items:result.orderitems})
//       }
//       else
//       {
//         res.send({success:0})
//       }
//     }
//     catch(e)
//     {
//       res.send({success:-1})
//       console.log(e.message)
//     }
// })

// app.put("/api/updatestatus",async(req,res)=>
// {
//   try
//   {
//     const result = await orderModel.updateOne({_id:req.body.orderid},{status:req.body.newstatus})
//     console.log(result)
//     if(result.modifiedCount===1)
//     {
//       res.send({success:1})
//     }
//     else
//     {
//       res.send({success:0})
//     }
//   }
//   catch(e)
//   {
//    res.send({success:-1})
//   }
// })

// // GET /api/orders?start=YYYY-MM-DD&end=YYYY-MM-DD&pmode=cash
// app.get("/api/orders", async (req, res) => {
//   try {
//     const { day, pmode, page = 1, limit = 10 } = req.query; // defaults
//     const filter = {};

//     // Date filter for one day
//     if (day) {
//       const dayStart = new Date(day);
//       dayStart.setHours(0, 0, 0, 0);
//       const dayEnd = new Date(day);
//       dayEnd.setHours(23, 59, 59, 999);
//       filter.orderDate = { $gte: dayStart, $lte: dayEnd };
//     }

//     // Payment mode filter (case-insensitive regex)
//     if (pmode && pmode !== "all") {
//       filter.pmode = new RegExp(pmode, "i");
//     }

//     // Pagination
//     const pageNumber = parseInt(page);
//     const limitNumber = parseInt(limit);

//     // Count total matching documents:
//     const totalOrders = await orderModel.countDocuments(filter);

//     const orders = await orderModel.find(filter)
//       .sort({ orderDate: -1 })
//       .skip((pageNumber - 1) * limitNumber)
//       .limit(limitNumber);

//     return res.send({
//       success: 1,
//       odata: orders,
//       totalOrders,
//       totalPages: Math.ceil(totalOrders / limitNumber),
//       currentPage: pageNumber
//     });
//   } catch (e) {
//     res.send({ success: -1, message: e.message });
//   }
// });


//mailing

// app.post('/api/contact', async (req, res) => {
//   try {
//    const { name, email, message, captcha } = req.body;

//  const captchaVerify = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`
//     );
//      if (!captchaVerify.data.success) {
//       return res.status(400).send({ success: 0, message: "Captcha failed" });
//     }
//     if (!name || !email || !message) {
//       return res.status(400).json({ success: false, message: 'Missing required fields' });
//     }

//     // Mailtrap SMTP configuration as per your credentials screenshot
   

//     const mailOptions = {
//       from: `no-reply@demomailtrap.co`, // Should be a domain you own/control for real sending, but works in Mailtrap
//       to: process.env.EMAIL_USER,   // Where you want to receive emails
//       subject: `Contact Form Submission from ${name}`,
//       text: `
//         You have a new contact form submission:
//         Name: ${name}
//         Email: ${email}
//         Message: ${message}
//       `,
//       html: `
//         <h3>You have a new contact form submission</h3>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Message:</strong> ${message}</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ success: true, message: 'Email sent successfully' });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({ success: false, message: 'Failed to send email' });
//   }
// });



app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

