// src/validations/article.validation.js
import Joi from "joi";

const sectionSchema = Joi.object({
  heading: Joi.string().allow(""),
  content: Joi.string().required(),
  pageNumber: Joi.number().integer().min(1).required()
});

export const createArticleSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().required(),
    projectCode: Joi.string().required(),
    abstract: Joi.string().required(),
    bodySections: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(sectionSchema).min(1)
    ).required(),
    previewPageLimit: Joi.number().integer().min(1).default(2),
    topicId: Joi.string().hex().length(24).required(),
    departmentId: Joi.string().hex().length(24).required(),
    tags: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ),
    allowDownload: Joi.boolean(),
    priceLocal: Joi.number().min(0),
    priceInternational: Joi.number().min(0),
    totalPages: Joi.number().integer().min(1)
  })
});

export const articleParamSchema = Joi.object({
  params: Joi.object({
    articleId: Joi.string().hex().length(24).required()
  })
});