const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = "mySuperSecretKey"; // use env variable in real projects

const userAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Fallback: read token from Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).send("❌ Unauthorized: Token missing. Please login again.");
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).send("❌ User not found.");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("❌ Invalid or expired token: " + err.message);
  }
};

module.exports = { userAuth };
