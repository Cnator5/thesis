// src/routes/topic.routes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import validate from "../middleware/validateRequest.js";
import {
  createTopic,
  listTopics,
  getTopic,
  updateTopic,
  deleteTopic
} from "../controllers/topic.controller.js";
import {
  createTopicSchema,
  topicParamSchema
} from "../validations/topic.validation.js";

const router = Router();

router.get("/", listTopics);
router.get("/:topicId", validate(topicParamSchema), getTopic);

router.post("/", auth, admin, validate(createTopicSchema), createTopic);
router.put("/:topicId", auth, admin, validate(topicParamSchema), updateTopic);
router.delete("/:topicId", auth, admin, validate(topicParamSchema), deleteTopic);

export default router;