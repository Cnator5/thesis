// src/routes/lesson.routes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import validate from "../middleware/validateRequest.js";
import {
  createLesson,
  listLessons
} from "../controllers/lesson.controller.js";
import { createLessonSchema } from "../validations/lesson.validation.js";

const router = Router();

router.get("/:courseId", listLessons);
router.post("/", auth, validate(createLessonSchema), createLesson);

export default router;