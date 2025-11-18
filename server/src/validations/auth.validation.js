// src/validations/auth.validation.js
import Joi from "joi";

export const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(3).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow(""),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("RESEARCHER", "STUDENT").optional()
  })
});

export const adminCreateSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(3).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow(""),
    password: Joi.string().min(8).required()
  })
});

export const verifyOtpSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
  })
});

export const loginSchema = Joi.object({
  body: Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required()
  })
});

export const resendOtpSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required()
  })
});

export const forgotPasswordSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required()
  })
});

export const resetPasswordSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required()
  })
    .messages({
      "any.only": "Passwords do not match."
    })
});