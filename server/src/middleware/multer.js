// src/middleware/multer.js
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/png",
      "image/jpeg",
      "application/pdf",
      "video/mp4",
      "video/mpeg"
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
  }
});

export default upload;