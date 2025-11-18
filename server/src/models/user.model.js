// src/models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: { type: String, trim: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["ADMIN", "RESEARCHER", "STUDENT"],
      default: "STUDENT"
    },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE"
    },

    isVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },

    avatarUrl: String,

    otpHash: String,
    otpExpiresAt: Date,
    lastOtpSentAt: Date,

    passwordResetHash: String,
    passwordResetExpiresAt: Date,

    refreshToken: String,
    lastLoginAt: Date
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;