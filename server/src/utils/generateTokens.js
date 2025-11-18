// src/utils/generateTokens.js
import jwt from "jsonwebtoken";

export const generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_KEY_ACCESS_TOKEN,
    { expiresIn: process.env.ACCESS_TOKEN_TTL || "15m" }
  );

export const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_KEY_REFRESH_TOKEN,
    { expiresIn: process.env.REFRESH_TOKEN_TTL || "7d" }
  );