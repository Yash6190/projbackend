const axios = require("axios");
const transporter = require("../utils/mailer"); // Your nodemailer transporter setup

exports.sendContactEmail = async (req, res) => {
  try {
   const { name, email, message, captcha } = req.body;

 const captchaVerify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`
    );
     if (!captchaVerify.data.success) {
      return res.status(400).send({ success: 0, message: "Captcha failed" });
    }
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Mailtrap SMTP configuration as per your credentials screenshot
   

    const mailOptions = {
      from: `no-reply@demomailtrap.co`, // Should be a domain you own/control for real sending, but works in Mailtrap
      to: process.env.EMAIL_USER,   // Where you want to receive emails
      subject: `Contact Form Submission from ${name}`,
      text: `
        You have a new contact form submission:
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h3>You have a new contact form submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};
