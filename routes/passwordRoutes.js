const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// For forgot password link (GET: /api/forgotpassword?un=test@gmail.com)
router.get('/forgotpassword', passwordController.forgotPassword);

// For resetting password (POST: /api/resetpassword, body: {token, newpass})
router.post('/resetpassword', passwordController.resetPassword);

module.exports = router;
