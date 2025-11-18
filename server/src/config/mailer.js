// src/config/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
  console.warn("⚠️  SMTP credentials missing, email sending will fail.");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default transporter;