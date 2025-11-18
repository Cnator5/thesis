// src/utils/otp.js
export const generateOtp = (length = 6) => {
  const min = 10 ** (length - 1);
  return Math.floor(Math.random() * (9 * min) + min).toString();
};