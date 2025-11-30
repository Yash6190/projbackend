const express = require('express');
const jwt = require('jsonwebtoken');
const { verifyToken, verifyAdmin, verifyRefreshToken } = require('../utils/authMiddleware');

const router = express.Router();

// Token refresh route
router.post("/refresh", verifyRefreshToken, (req, res) => {
  const payload = req.refreshPayload;
  const newAccessToken = jwt.sign(
    { id: payload.id, role: payload.role },
    process.env.JWT_KEY,
    { expiresIn: "15m" }
  );
  res.cookie("jtoken", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000
  });
  return res.json({ success: 1, message: "Token refreshed" });
});


module.exports = router;
