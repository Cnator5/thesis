// src/controllers/user.controller.js
import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import transporter from "../config/mailer.js";
import { adminWelcomeTemplate } from "../utils/emailTemplates.js";
import sanitizeUser from "../utils/sanitizeUser.js";

export const getAllUsers = async (_req, res) => {
  const users = await UserModel.find().sort({ createdAt: -1 });
  res.json({ success: true, data: users.map(sanitizeUser) });
};

export const registerNewAdmin = async (req, res) => {
  const { name, username, email, password, phone } = req.body;

  const emailLower = email.trim().toLowerCase();
  const usernameLower = username.trim().toLowerCase();

  const existing = await UserModel.findOne({
    $or: [{ email: emailLower }, { username: usernameLower }]
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Email or username already registered."
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await UserModel.create({
    name: name.trim(),
    username: usernameLower,
    email: emailLower,
    phone,
    password: hashedPassword,
    role: "ADMIN",
    status: "ACTIVE",
    isVerified: true,
    emailVerified: true,
    phoneVerified: Boolean(phone)
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? "Research Guru <no-reply@researchguru.pro>",
    to: admin.email,
    subject: "Admin account created",
    html: adminWelcomeTemplate({ name: admin.name, email: admin.email })
  });

  res.status(201).json({
    success: true,
    message: "Admin created successfully.",
    data: sanitizeUser(admin)
  });
};

export const updateProfile = async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: "Name is required." });
  }

  const update = await UserModel.findByIdAndUpdate(
    req.user.id,
    {
      name: name.trim(),
      phone: phone?.trim() || undefined
    },
    { new: true }
  );

  res.json({
    success: true,
    message: "Profile updated successfully.",
    data: sanitizeUser(update)
  });
};