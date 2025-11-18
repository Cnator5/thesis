// src/controllers/book.controller.js
import BookModel from "../models/book.model.js";
import DepartmentModel from "../models/department.model.js";
import TopicModel from "../models/topic.model.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

const parseFlexibleField = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return input.split(",").map((item) => item.trim()).filter(Boolean);
  }
};

export const createBook = async (req, res) => {
  const {
    title,
    isbn,
    authors,
    departmentId,
    topicId,
    categories,
    summary,
    tags,
    copiesOwned,
    copiesAvailable,
    location,
    publishYear
  } = req.body;

  if (departmentId) {
    const dept = await DepartmentModel.findById(departmentId);
    if (!dept) {
      return res.status(404).json({ success: false, message: "Department not found." });
    }
  }

  if (topicId) {
    const topic = await TopicModel.findById(topicId);
    if (!topic) {
      return res.status(404).json({ success: false, message: "Topic not found." });
    }
  }

  let coverImage;
  let documentUrl;
  let documentPublicId;

  if (req.files?.coverImage?.length) {
    const file = req.files.coverImage[0];
    const upload = await uploadBufferToCloudinary(file.buffer, {
      folder: "research/library/covers",
      resourceType: "image"
    });
    coverImage = upload.secure_url;
  }

  if (req.files?.bookDocument?.length) {
    const file = req.files.bookDocument[0];
    const upload = await uploadBufferToCloudinary(file.buffer, {
      folder: "research/library/documents",
      resourceType: "raw"
    });
    documentUrl = upload.secure_url;
    documentPublicId = upload.public_id;
  }

  const book = await BookModel.create({
    title,
    isbn,
    authors: parseFlexibleField(authors),
    department: departmentId || undefined,
    topic: topicId || undefined,
    categories: parseFlexibleField(categories),
    summary,
    tags: parseFlexibleField(tags),
    coverImage,
    documentUrl,
    documentPublicId,
    copiesOwned: Number(copiesOwned) || 1,
    copiesAvailable: Number(copiesAvailable) ?? Number(copiesOwned) ?? 1,
    location,
    publishYear: publishYear ? Number(publishYear) : undefined
  });

  res.status(201).json({
    success: true,
    message: "Book added successfully.",
    data: book
  });
};

export const listBooks = async (req, res) => {
  const filter = {};
  if (req.query.departmentId) filter.department = req.query.departmentId;
  if (req.query.topicId) filter.topic = req.query.topicId;
  if (req.query.keyword) filter.$text = { $search: req.query.keyword };

  const books = await BookModel.find(filter)
    .populate("department", "name")
    .populate("topic", "title")
    .select("title authors coverImage copiesAvailable location status")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: books });
};

export const getBook = async (req, res) => {
  const book = await BookModel.findById(req.params.bookId)
    .populate("department", "name")
    .populate("topic", "title code");
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found." });
  }
  res.json({ success: true, data: book });
};

export const updateBook = async (req, res) => {
  const payload = { ...req.body };

  if (payload.authors) payload.authors = parseFlexibleField(payload.authors);
  if (payload.categories) payload.categories = parseFlexibleField(payload.categories);
  if (payload.tags) payload.tags = parseFlexibleField(payload.tags);
  if (payload.copiesOwned) payload.copiesOwned = Number(payload.copiesOwned);
  if (payload.copiesAvailable) payload.copiesAvailable = Number(payload.copiesAvailable);
  if (payload.publishYear) payload.publishYear = Number(payload.publishYear);

  const updated = await BookModel.findByIdAndUpdate(
    req.params.bookId,
    payload,
    { new: true }
  );

  res.json({ success: true, message: "Book updated.", data: updated });
};

export const deleteBook = async (req, res) => {
  await BookModel.findByIdAndDelete(req.params.bookId);
  res.json({ success: true, message: "Book removed." });
};