// src/routes/dashboard.routes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import {
  studentDashboard,
  instructorDashboard,
  adminDashboard
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/student", auth, studentDashboard);
router.get("/instructor", auth, instructorDashboard);
router.get("/admin", auth, admin, adminDashboard);

export default router;