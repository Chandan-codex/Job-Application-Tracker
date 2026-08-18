const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token;

  // Check for Bearer token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Extract token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach authenticated user's ID to req.user
      req.user = { id: decoded.id };

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = authMiddleware;
