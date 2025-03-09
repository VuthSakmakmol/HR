const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("🔹 Incoming Headers:", req.headers); // Debugging

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token
  console.log("🔹 Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Verified:", decoded); // Debugging
    req.user = decoded; // Attach user payload
    next(); // Move to next middleware
  } catch (error) {
    console.error("❌ Token Verification Failed:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Session expired. Please log in again." });
    }

    res.status(401).json({ msg: "Unauthorized: Invalid token." });
  }
};

module.exports = authMiddleware;
