// src/routes/course.routes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import validate from "../middleware/validateRequest.js";
import {
  createCourse,
  listCourses,
  getCourse,
  updateCourse,
  approveCourse,
  enrolCourse
} from "../controllers/course.controller.js";
import {
  createCourseSchema,
  courseParamSchema
} from "../validations/course.validation.js";

const router = Router();

router.get("/", listCourses);
router.get("/:courseId", validate(courseParamSchema), getCourse);

router.post("/", auth, validate(createCourseSchema), createCourse);
router.put("/:courseId", auth, validate(courseParamSchema), updateCourse);
router.put("/:courseId/status", auth, admin, validate(courseParamSchema), approveCourse);
router.post("/:courseId/enrol", auth, validate(courseParamSchema), enrolCourse);

export default router;