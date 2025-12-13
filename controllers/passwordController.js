const RegisterModel = require('../models/registerModel');
const resetPassModel = require('../models/resetPassModel');
const transporter = require('../utils/mailer');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

exports.forgotPassword = async (req, res) => {
  const passtoken = uuidv4();
  const exptm = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

  try {
    const result = await RegisterModel.findOne({ username: req.query.un });
    if (!result) {
      return res.send({ success: 3 }); // Invalid username
    }

    // Remove old reset tokens
    await resetPassModel.deleteMany({ username: req.query.un });

    // Save new reset record
    const newrecord = new resetPassModel({
      username: req.query.un,
      exptime: exptm,
      token: passtoken
    });

    const result2 = await newrecord.save();
    if (!result2) return res.send({ success: 0 });

    // Send reset mail
    const mailOptions = {
      from: "no-reply@demomailtrap.co",
      to: req.query.un,
      subject: "Reset Password Mail from SuperMarket.com",
      html: `
        Dear ${result.name},<br/><br/>
        Click on the following link to reset your password:<br/><br/>
        <a href='https://projfrontend-98eb.onrender.com/resetpassword?code=${passtoken}'>
            Reset Password
        </a><br/><br/>
        This link will expire in 15 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.send({ success: 2 });
      } else {
        console.log("Email sent: " + info.response);
        res.send({ success: 1 });
      }
    });
  } catch (e) {
    console.log(e.message);
    res.send({ success: -1 });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newpass } = req.body;

    const resetRecord = await resetPassModel.findOne({ token });
    if (!resetRecord) {
      return res.send({ success: 0, message: "Invalid reset link" });
    }

    if (resetRecord.exptime < Date.now()) {
      return res.send({ success: 2, message: "Reset link expired" });
    }

    const user = await RegisterModel.findOne({ username: resetRecord.username });
    if (!user) {
      return res.send({ success: 0, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newpass, 10);
    user.password = hashedPassword;
    await user.save();

    await resetPassModel.deleteOne({ token });

    res.send({ success: 1, message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.send({ success: -1, message: "Server error" });
  }
};
