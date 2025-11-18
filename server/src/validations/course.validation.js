// src/validations/course.validation.js
import Joi from "joi";

export const createCourseSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    objectives: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ),
    prerequisites: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ),
    durationWeeks: Joi.number().integer().min(1),
    level: Joi.string().valid("Beginner", "Intermediate", "Advanced"),
    departmentId: Joi.string().hex().length(24).required(),
    topicId: Joi.string().hex().length(24).required(),
    price: Joi.number().min(0)
  })
});

export const courseParamSchema = Joi.object({
  params: Joi.object({
    courseId: Joi.string().hex().length(24).required()
  })
});