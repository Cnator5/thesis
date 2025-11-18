// src/controllers/department.controller.js
import slugify from "slugify";
import DepartmentModel from "../models/department.model.js";

export const createDepartment = async (req, res) => {
  const { name, description } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  const clash = await DepartmentModel.findOne({ slug });
  if (clash) {
    return res.status(409).json({ success: false, message: "Department already exists." });
  }

  const department = await DepartmentModel.create({
    name,
    slug,
    description,
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    message: "Department created successfully.",
    data: department
  });
};

export const listDepartments = async (_req, res) => {
  const departments = await DepartmentModel.find().sort("name");
  res.json({ success: true, data: departments });
};

export const getDepartment = async (req, res) => {
  const department = await DepartmentModel.findById(req.params.departmentId);
  if (!department) {
    return res.status(404).json({ success: false, message: "Department not found." });
  }
  res.json({ success: true, data: department });
};

export const updateDepartment = async (req, res) => {
  const { name, description } = req.body;
  const payload = { description };

  if (name) {
    payload.name = name;
    payload.slug = slugify(name, { lower: true, strict: true });
  }

  const updated = await DepartmentModel.findByIdAndUpdate(
    req.params.departmentId,
    payload,
    { new: true }
  );

  res.json({ success: true, message: "Department updated.", data: updated });
};

export const deleteDepartment = async (req, res) => {
  await DepartmentModel.findByIdAndDelete(req.params.departmentId);
  res.json({ success: true, message: "Department deleted." });
};