// src/utils/cloudinaryUpload.js
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = (buffer, { folder, resourceType = "image" }) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });