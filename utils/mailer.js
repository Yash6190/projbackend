require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your Gmail address set in .env
    pass: process.env.EMAIL_PASS,  // Your Gmail app password or OAuth token
  }
});

// Optional: verify connection configuration once when app starts
transporter.verify(function(error, success) {
  if (error) {
    console.log('Mailer connection error:', error);
  } else {
    console.log('Mailer is ready to send emails');
  }
});

module.exports = transporter;
