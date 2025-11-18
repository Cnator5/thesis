// src/middleware/auth.js
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = req.cookies?.accessToken || (header && header.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default auth;