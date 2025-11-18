// src/routes/department.routes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import validate from "../middleware/validateRequest.js";
import {
  createDepartment,
  listDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment
} from "../controllers/department.controller.js";
import {
  createDepartmentSchema,
  departmentParamSchema
} from "../validations/department.validation.js";

const router = Router();

router.get("/", listDepartments);
router.get("/:departmentId", validate(departmentParamSchema), getDepartment);

router.post("/", auth, admin, validate(createDepartmentSchema), createDepartment);
router.put("/:departmentId", auth, admin, validate(departmentParamSchema), updateDepartment);
router.delete("/:departmentId", auth, admin, validate(departmentParamSchema), deleteDepartment);

export default router;