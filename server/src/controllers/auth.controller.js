// src/controllers/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

import UserModel from "../models/user.model.js";
import transporter from "../config/mailer.js";
import { generateOtp } from "../utils/otp.js";
import {
  verificationEmailTemplate,
  passwordResetTemplate
} from "../utils/emailTemplates.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import { sendOtpViaWhatsApp } from "../utils/sendSMS.js";
import sanitizeUser from "../utils/sanitizeUser.js";

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES ?? 15);
const OTP_RESEND_WAIT_SECONDS = Number(process.env.OTP_RESEND_WAIT_SECONDS ?? 60);
const RESET_TOKEN_TTL_MINUTES = Number(process.env.RESET_TOKEN_TTL_MINUTES ?? 30);

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
};

const accessCookieOptions = {
  ...baseCookieOptions,
  maxAge: 15 * 60 * 1000
};

const refreshCookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const sendOtpNotification = async ({ email, name, phone, otp, subject }) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? "Research Guru <no-reply@researchguru.pro>",
    to: email,
    subject,
    html: verificationEmailTemplate({ name, otp })
  });

  if (phone) {
    const formatted = phone.startsWith("+")
      ? phone
      : `+${process.env.DEFAULT_WHATSAPP_COUNTRY_CODE ?? ""}${phone}`;
    await sendOtpViaWhatsApp({ to: formatted, otp });
  }
};

export const register = async (req, res) => {
  const { name, username, email, password, phone, role } = req.body;

  const emailLower = email.trim().toLowerCase();
  const usernameLower = username.trim().toLowerCase();

  const existing = await UserModel.findOne({
    $or: [{ email: emailLower }, { username: usernameLower }]
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Email or username already in use."
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiry = dayjs().add(OTP_EXPIRY_MINUTES, "minute").toDate();

  const allowedRoles = ["RESEARCHER", "STUDENT"];
  const assignedRole = allowedRoles.includes(role) ? role : "STUDENT";

  const user = await UserModel.create({
    name: name.trim(),
    username: usernameLower,
    email: emailLower,
    phone,
    password: hashedPassword,
    role: assignedRole,
    otpHash,
    otpExpiresAt: expiry,
    lastOtpSentAt: new Date()
  });

  await sendOtpNotification({
    email: user.email,
    name: user.name,
    phone: user.phone,
    otp,
    subject: "Verify your Research Guru account"
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(`🔐 OTP for ${user.email}: ${otp}`);
  }

  res.status(201).json({
    success: true,
    message: "Registration successful. Check your email/phone for the verification code.",
    data: sanitizeUser(user)
  });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  if (user.isVerified) {
    return res.json({ success: true, message: "Account already verified.", data: sanitizeUser(user) });
  }

  if (!user.otpHash || !user.otpExpiresAt) {
    return res.status(400).json({ success: false, message: "OTP not set. Request a new one." });
  }

  if (dayjs().isAfter(dayjs(user.otpExpiresAt))) {
    return res.status(400).json({ success: false, message: "OTP has expired. Request a new one." });
  }

  const isMatch = await bcrypt.compare(otp, user.otpHash);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: "Invalid OTP." });
  }

  user.isVerified = true;
  user.emailVerified = true;
  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  user.lastOtpSentAt = undefined;

  await user.save();

  res.json({
    success: true,
    message: "Account verified successfully.",
    data: sanitizeUser(user)
  });
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  if (user.isVerified) {
    return res.status(400).json({ success: false, message: "User already verified." });
  }

  if (user.lastOtpSentAt) {
    const nextAllowed = dayjs(user.lastOtpSentAt).add(OTP_RESEND_WAIT_SECONDS, "second");
    if (dayjs().isBefore(nextAllowed)) {
      const waitSeconds = nextAllowed.diff(dayjs(), "second");
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSeconds} seconds before requesting a new OTP.`
      });
    }
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  user.otpHash = otpHash;
  user.otpExpiresAt = dayjs().add(OTP_EXPIRY_MINUTES, "minute").toDate();
  user.lastOtpSentAt = new Date();

  await user.save();

  await sendOtpNotification({
    email: user.email,
    name: user.name,
    phone: user.phone,
    otp,
    subject: "Your new Research Guru verification code"
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(`🔄 Resent OTP for ${user.email}: ${otp}`);
  }

  res.json({ success: true, message: "OTP resent successfully." });
};

export const login = async (req, res) => {
  const { identifier, password } = req.body;

  const lookup = identifier.includes("@")
    ? { email: identifier.trim().toLowerCase() }
    : { username: identifier.trim().toLowerCase() };

  const user = await UserModel.findOne(lookup);
  if (!user) {
    return res.status(404).json({ success: false, message: "Invalid credentials." });
  }

  if (!user.isVerified) {
    return res.status(403).json({ success: false, message: "Please verify your account first." });
  }

  if (user.status !== "ACTIVE") {
    return res.status(403).json({ success: false, message: "Account suspended. Contact support." });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ success: false, message: "Invalid credentials." });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  await user.save();

  res
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .json({
      success: true,
      message: "Login successful.",
      data: {
        user: sanitizeUser(user),
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
};

export const refreshToken = async (req, res) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.headers?.authorization?.split(" ")[1] ||
      req.body?.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "Refresh token missing." });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_REFRESH_TOKEN);
    const user = await UserModel.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: "Refresh token invalid." });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res
      .cookie("accessToken", newAccessToken, accessCookieOptions)
      .cookie("refreshToken", newRefreshToken, refreshCookieOptions)
      .json({
        success: true,
        message: "Tokens refreshed.",
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Refresh token expired or invalid." });
  }
};

export const logout = async (req, res) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.headers?.authorization?.split(" ")[1] ||
      req.body?.refreshToken;

    if (token) {
      const user = await UserModel.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res
      .clearCookie("accessToken", accessCookieOptions)
      .clearCookie("refreshToken", refreshCookieOptions)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Logout failed." });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const otp = generateOtp();
  const hash = await bcrypt.hash(otp, 10);

  user.passwordResetHash = hash;
  user.passwordResetExpiresAt = dayjs().add(RESET_TOKEN_TTL_MINUTES, "minute").toDate();
  await user.save();

  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? "Research Guru <no-reply@researchguru.pro>",
    to: user.email,
    subject: "Password reset code",
    html: passwordResetTemplate({ name: user.name, otp })
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(`🔐 Password reset OTP for ${user.email}: ${otp}`);
  }

  res.json({ success: true, message: "Password reset OTP sent." });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user || !user.passwordResetHash) {
    return res.status(400).json({ success: false, message: "Invalid request." });
  }

  if (dayjs().isAfter(dayjs(user.passwordResetExpiresAt))) {
    return res.status(400).json({ success: false, message: "OTP expired." });
  }

  const isValid = await bcrypt.compare(otp, user.passwordResetHash);
  if (!isValid) {
    return res.status(400).json({ success: false, message: "Invalid OTP." });
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.passwordResetHash = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful." });
};

export const me = async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  res.json({ success: true, data: sanitizeUser(user) });
};