// src/utils/emailTemplates.js
export const verificationEmailTemplate = ({ name, otp }) => `
  <div style="font-family: Arial, sans-serif; color: #222;">
    <h2>Hello ${name ?? "there"},</h2>
    <p>Your Research Guru verification code is:</p>
    <h1 style="letter-spacing: 6px;">${otp}</h1>
    <p>This code expires in ${process.env.OTP_EXPIRY_MINUTES ?? 15} minutes.</p>
    <p>If you didn’t request it, simply ignore this email.</p>
  </div>
`;

export const passwordResetTemplate = ({ name, otp }) => `
  <div style="font-family: Arial, sans-serif; color: #222;">
    <h2>Hello ${name ?? "there"},</h2>
    <p>Use the code below to reset your password:</p>
    <h1 style="letter-spacing: 6px;">${otp}</h1>
    <p>This code will expire in ${process.env.RESET_TOKEN_TTL_MINUTES ?? 30} minutes.</p>
  </div>
`;

export const overdueReminderTemplate = ({ name, bookTitle, dueAt, fineEstimate }) => `
  <div style="font-family: Arial, sans-serif; color:#333;">
    <h2>Hello ${name},</h2>
    <p>The book <strong>${bookTitle}</strong> was due on <strong>${dueAt}</strong>.</p>
    <p>Current estimated fine: <strong>${fineEstimate} FCFA</strong>.</p>
    <p>Please return it to avoid additional charges.</p>
    <p>Thank you,<br />Research Guru Library</p>
  </div>
`;

export const adminWelcomeTemplate = ({ name, email }) => `
  <div style="font-family: Arial, sans-serif; color:#333;">
    <h2>Welcome aboard, ${name}!</h2>
    <p>Your Research Guru admin account has been created.</p>
    <p>You can now sign in using the email <strong>${email}</strong>.</p>
    <p>For security, please change your password after the first login.</p>
    <p>Best regards,<br />Research Guru</p>
  </div>
`;