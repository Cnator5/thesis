// src/validations/topic.validation.js
import Joi from "joi";

export const createTopicSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().required(),
    code: Joi.string().required(),
    summary: Joi.string().allow(""),
    keywords: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ),
    departmentId: Joi.string().hex().length(24).required()
  })
});

export const topicParamSchema = Joi.object({
  params: Joi.object({
    topicId: Joi.string().hex().length(24).required()
  })
});