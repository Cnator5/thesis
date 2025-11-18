// src/controllers/topic.controller.js
import slugify from "slugify";
import TopicModel from "../models/topic.model.js";
import DepartmentModel from "../models/department.model.js";

const parseKeywords = (keywords) => {
  if (!keywords) return [];
  if (Array.isArray(keywords)) return keywords;
  try {
    const parsed = JSON.parse(keywords);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return keywords.split(",").map((item) => item.trim()).filter(Boolean);
  }
};

export const createTopic = async (req, res) => {
  const { title, code, summary, keywords, departmentId } = req.body;

  const department = await DepartmentModel.findById(departmentId);
  if (!department) {
    return res.status(404).json({ success: false, message: "Department not found." });
  }

  const topic = await TopicModel.create({
    title,
    code,
    summary,
    keywords: parseKeywords(keywords),
    department: departmentId,
    slug: slugify(`${title}-${code}`, { lower: true, strict: true }),
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    message: "Topic created successfully.",
    data: topic
  });
};

export const listTopics = async (req, res) => {
  const filter = {};
  if (req.query.departmentId) filter.department = req.query.departmentId;
  if (req.query.status) filter.status = req.query.status;

  const topics = await TopicModel.find(filter)
    .populate("department", "name slug")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: topics });
};

export const getTopic = async (req, res) => {
  const topic = await TopicModel.findById(req.params.topicId)
    .populate("department", "name slug");
  if (!topic) {
    return res.status(404).json({ success: false, message: "Topic not found." });
  }
  res.json({ success: true, data: topic });
};

export const updateTopic = async (req, res) => {
  const { title, summary, keywords, status } = req.body;
  const payload = { summary, status };

  if (keywords !== undefined) {
    payload.keywords = parseKeywords(keywords);
  }

  if (title) {
    payload.title = title;
    payload.slug = slugify(`${title}-${Date.now()}`, { lower: true, strict: true });
  }

  const updated = await TopicModel.findByIdAndUpdate(
    req.params.topicId,
    payload,
    { new: true }
  );

  res.json({ success: true, message: "Topic updated.", data: updated });
};

export const deleteTopic = async (req, res) => {
  await TopicModel.findByIdAndDelete(req.params.topicId);
  res.json({ success: true, message: "Topic deleted." });
};