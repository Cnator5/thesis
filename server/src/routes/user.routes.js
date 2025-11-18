// src/routes/user.routes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import validate from "../middleware/validateRequest.js";
import {
  getAllUsers,
  registerNewAdmin,
  updateProfile
} from "../controllers/user.controller.js";
import { adminCreateSchema } from "../validations/auth.validation.js";

const router = Router();

router.get("/", auth, admin, getAllUsers);
router.post("/create-admin", auth, admin, validate(adminCreateSchema), registerNewAdmin);
router.put("/profile", auth, updateProfile);

export default router;