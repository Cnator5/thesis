// src/middleware/admin.js
const admin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Admin privileges required" });
  }
  next();
};

export default admin;