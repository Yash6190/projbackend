const RegisterModel = require('../models/registerModel');
const bcrypt = require('bcrypt');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const transporter = require('../utils/mailer'); // Assuming mailer is set up for sending mail

exports.register = async (req, res) => {
  try {
    const { pname, phone, uname, pass, captcha } = req.body;

    const captchaVerify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`
    );
    if (!captchaVerify.data.success) {
      return res.status(400).send({ success: 0, message: "Captcha failed" });
    }

    const acttoken = uuidv4();
    const hashedPassword = await bcrypt.hash(pass, 10);

    const newrecord = new RegisterModel({
      name: pname,
      phone,
      username: uname,
      password: hashedPassword,
      usertype: "normal",
      actstatus: false,
      token: acttoken,
    });

    const result = await newrecord.save();
    if (result) {
      const mailOptions = {
        from: 'no-reply@demomailtrap.co',
        to: uname,
        subject: `Activate your SuperMarket account`,
        html: `
          <h3>Activate your SuperMarket account</h3>
          <p>Hi ${pname},</p>
          <p>Thanks for signing up. Please activate your account by clicking the link below:</p>
          <a href="http://localhost:3000/activate?code=${acttoken}">Activate Account</a>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: 'Registration successful, email sent.' });
    } else {
      res.status(500).json({ success: false, message: 'Could not save user.' });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.activate = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.send({ success: 0, message: "Activation code is missing." });

    const user = await RegisterModel.findOne({ token: code });
    if (!user) return res.send({ success: 0, message: "Invalid or expired activation code." });

    const now = new Date();
    const expiry = new Date(user.createdAt.getTime() + 15 * 60000); // 15 minutes

    if (!user.actstatus && now > expiry) {
      await RegisterModel.deleteOne({ token: code, actstatus: false });
      return res.send({ success: 0, message: "Activation code has expired. Account deleted." });
    }

    if (!user.actstatus) {
      await RegisterModel.updateOne({ token: code }, { actstatus: true });
      return res.send({ success: 1 });
    }

    return res.send({ success: 0, message: "Account already activated." });

  } catch (e) {
    res.send({ success: -1, message: "Server error: " + e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { uname, pass, captcha } = req.body;

    const captchaVerify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`
    );
    if (!captchaVerify.data.success) return res.status(400).send({ success: 0, message: "Captcha failed" });

    const user = await RegisterModel.findOne({ username: uname });
    if (!user) return res.send({ success: 0 });

    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (!passwordMatch) return res.send({ success: 0 });

    const accessToken = jwt.sign(
      { id: user._id, role: user.usertype },
      process.env.JWT_KEY,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.usertype },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jtoken", accessToken, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 15 * 60 * 1000 });
    res.cookie("rftoken", refreshToken, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

    const respdata = {
      _id: user._id,
      name: user.name,
      username: user.username,
      usertype: user.usertype,
      actstatus: user.actstatus
    };

   return res.send({
  success: 1,
  udata: respdata,
  token: accessToken
});


  } catch (e) {
    return res.send({ success: -1 });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await RegisterModel.find();
    if (users.length === 0) {
      return res.send({ success: 0 });
    }
    res.send({ success: 1, udata: users });
  } catch (e) {
    res.send({ success: -1 });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const del = await RegisterModel.findByIdAndDelete(req.params.uid);
    if (del) return res.send({ success: 1 });
    else return res.send({ success: 0 });
  } catch (e) {
    res.send({ success: -1 });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { uname, cpass, newpass } = req.body;
    if (!uname || !cpass || !newpass) {
      return res.send({ success: 0, message: "Missing fields." });
    }

    // Find user by username
    const user = await RegisterModel.findOne({ username: uname });
    if (!user) {
      return res.send({ success: 0, message: "User not found." });
    }

    // Check current password
    const match = await bcrypt.compare(cpass, user.password);
    if (!match) {
      return res.send({ success: 0, message: "Current password incorrect." });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newpass, 10);

    const result = await RegisterModel.updateOne(
      { username: uname },
      { password: hashedNewPassword }
    );

    console.log(result);

    if (result.modifiedCount === 1) {
      res.send({ success: 1 });
    } else {
      res.send({ success: 0, message: "Password not changed." });
    }
  } catch (e) {
    res.send({ success: -1, message: e.message });
  }
};
exports.searchUser = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.json({ success: 0, message: "Email required" });
    }

    // Search in username (because email is stored in username)
    const user = await RegisterModel.findOne({
      username: { $regex: email, $options: "i" }
    });

    if (!user) {
      return res.json({ success: 0, message: "User not found" });
    }

    return res.json({ success: 1, udata: user });

  } catch (err) {
    return res.status(500).json({
      success: -1,
      message: err.message
    });
  }
};
