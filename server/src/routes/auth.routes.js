// src/routes/auth.routes.js
import { Router } from "express";
import validate from "../middleware/validateRequest.js";
import auth from "../middleware/auth.js";

import {
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  me
} from "../controllers/auth.controller.js";

import {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../validations/auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", validate(resendOtpSchema), resendOtp);
router.post("/login", validate(loginSchema), login);
router.post("/logout", auth, logout);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/me", auth, me);

export default router;