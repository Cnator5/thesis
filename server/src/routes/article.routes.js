// src/routes/article.routes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import multerUpload from "../middleware/multer.js";
import validate from "../middleware/validateRequest.js";
import {
  createArticle,
  listArticles,
  getArticlePreview,
  adminListArticles,
  updateArticleStatus,
  recordDownload
} from "../controllers/article.controller.js";
import {
  createArticleSchema,
  articleParamSchema
} from "../validations/article.validation.js";

const router = Router();

router.get("/", listArticles);
router.get("/:articleId", validate(articleParamSchema), getArticlePreview);

router.post(
  "/",
  auth,
  multerUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "pdfDocument", maxCount: 1 }
  ]),
  validate(createArticleSchema),
  createArticle
);

router.get("/admin/list", auth, admin, adminListArticles);
router.put("/:articleId/status", auth, admin, validate(articleParamSchema), updateArticleStatus);
router.post("/:articleId/download", auth, validate(articleParamSchema), recordDownload);

export default router;