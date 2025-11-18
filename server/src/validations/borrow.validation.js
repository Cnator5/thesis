// src/validations/borrow.validation.js
import Joi from "joi";

export const borrowBookSchema = Joi.object({
  body: Joi.object({
    userId: Joi.string().hex().length(24).required(),
    bookId: Joi.string().hex().length(24).required(),
    dueAt: Joi.date().iso().required(),
    notes: Joi.string().allow("")
  })
});

export const returnBookSchema = Joi.object({
  body: Joi.object({
    borrowId: Joi.string().hex().length(24).required(),
    returnedAt: Joi.date().iso().required()
  })
});