// src/routes/book.routes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import multerUpload from "../middleware/multer.js";
import validate from "../middleware/validateRequest.js";
import {
  createBook,
  listBooks,
  getBook,
  updateBook,
  deleteBook
} from "../controllers/book.controller.js";
import {
  createBookSchema,
  bookParamSchema
} from "../validations/book.validation.js";

const router = Router();

router.get("/", listBooks);
router.get("/:bookId", validate(bookParamSchema), getBook);

router.post(
  "/",
  auth,
  admin,
  multerUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookDocument", maxCount: 1 }
  ]),
  validate(createBookSchema),
  createBook
);

router.put("/:bookId", auth, admin, validate(bookParamSchema), updateBook);
router.delete("/:bookId", auth, admin, validate(bookParamSchema), deleteBook);

export default router;