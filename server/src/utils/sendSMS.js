// src/utils/sendSMS.js
import twilio from "twilio";

let client = null;

if (
  process.env.SMS_PROVIDER === "twilio" &&
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN
) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
} else {
  console.warn("⚠️  Twilio credentials not set. SMS/WhatsApp notifications are disabled.");
}

export const sendOtpViaWhatsApp = async ({ to, otp }) => {
  if (!client) return;
  try {
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${to}`,
      body: `Your Research Guru verification code is ${otp}.`
    });
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error.message);
  }
};