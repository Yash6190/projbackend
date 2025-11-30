const jwt = require('jsonwebtoken');

/**
 * Verifies the JWT access token from cookies.
 * Sets req.utype and req.userId for downstream use.
 */

function verifyToken(req, res, next) {
  const token = req.cookies.jtoken;

  if (!token) {
    return res.status(401).json({ success: -1, message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Store user info so next middleware can use it
    req.userId = decoded.id;
    req.utype = decoded.role;  // <-- IMPORTANT
    next();
  } catch (err) {
    return res.status(401).json({ success: -1, message: "Invalid token" });
  }
}

/**
 * Verifies that the authenticated user is an admin.
 * Should be used after verifyToken.
 */
function verifyAdmin(req, res, next) {
  if (req.utype === "admin") {
    next();
  } else {
    return res.status(401).send({ success: -2, message: "Admin access required" });
  }
}

/**
 * Verifies the JWT refresh token from cookies and generates new access token.
 * Usage: app.post("/api/refresh", verifyRefreshToken, ...)
 */
function verifyRefreshToken(req, res, next) {
  const refreshToken = req.cookies?.rftoken; // Expecting cookie as 'rftoken'

  if (!refreshToken) {
    return res.status(401).json({ success: 0, message: "No refresh token provided" });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    req.refreshPayload = payload; // attach for downstream use
    next();
  } catch (err) {
    return res.status(403).json({ success: 0, message: "Invalid refresh token" });
  }
}

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyRefreshToken
};
