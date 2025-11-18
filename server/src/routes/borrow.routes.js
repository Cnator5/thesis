// src/routes/borrow.routes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import validate from "../middleware/validateRequest.js";
import {
  recordBorrowBook,
  returnBorrowBook,
  borrowedBooks,
  getBorrowedByAdmin
} from "../controllers/borrow.controller.js";
import {
  borrowBookSchema,
  returnBookSchema
} from "../validations/borrow.validation.js";

const router = Router();

router.get("/me", auth, borrowedBooks);
router.get("/", auth, admin, getBorrowedByAdmin);

router.post("/", auth, admin, validate(borrowBookSchema), recordBorrowBook);
router.post("/return", auth, admin, validate(returnBookSchema), returnBorrowBook);

export default router;