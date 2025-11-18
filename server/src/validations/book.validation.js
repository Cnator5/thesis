// src/validations/book.validation.js
import Joi from "joi";

export const createBookSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().required(),
    isbn: Joi.string().allow(""),
    authors: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ),
    departmentId: Joi.string().hex().length(24).allow("", null),
    topicId: Joi.string().hex().length(24).allow("", null),
    categories: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ),
    summary: Joi.string().allow(""),
    tags: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ),
    copiesOwned: Joi.number().integer().min(1).default(1),
    copiesAvailable: Joi.number().integer().min(0),
    location: Joi.string().allow(""),
    publishYear: Joi.number().integer().allow(null)
  })
});

export const bookParamSchema = Joi.object({
  params: Joi.object({
    bookId: Joi.string().hex().length(24).required()
  })
});