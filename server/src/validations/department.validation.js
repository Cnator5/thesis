// src/validations/department.validation.js
import Joi from "joi";

export const createDepartmentSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().allow("")
  })
});

export const departmentParamSchema = Joi.object({
  params: Joi.object({
    departmentId: Joi.string().hex().length(24).required()
  })
});