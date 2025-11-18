// src/validations/lesson.validation.js
import Joi from "joi";

export const createLessonSchema = Joi.object({
  body: Joi.object({
    courseId: Joi.string().hex().length(24).required(),
    title: Joi.string().required(),
    order: Joi.number().integer().min(1).required(),
    content: Joi.string().allow(""),
    previewable: Joi.boolean(),
    videoUrl: Joi.string().uri().allow("")
  })
});