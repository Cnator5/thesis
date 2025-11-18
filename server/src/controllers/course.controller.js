// src/controllers/course.controller.js
import slugify from "slugify";
import CourseModel from "../models/course.model.js";
import DepartmentModel from "../models/department.model.js";
import TopicModel from "../models/topic.model.js";
import EnrollmentModel from "../models/enrollment.model.js";

const parseList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
};

export const createCourse = async (req, res) => {
  const {
    title,
    description,
    objectives,
    prerequisites,
    durationWeeks,
    level,
    departmentId,
    topicId,
    price
  } = req.body;

  const department = await DepartmentModel.findById(departmentId);
  const topic = await TopicModel.findById(topicId);

  if (!department || !topic) {
    return res.status(404).json({ success: false, message: "Department or topic not found." });
  }

  const slugBase = slugify(title, { lower: true, strict: true });
  let slug = slugBase;
  let counter = 1;

  while (await CourseModel.findOne({ slug })) {
    slug = `${slugBase}-${counter++}`;
  }

  const course = await CourseModel.create({
    title,
    slug,
    description,
    objectives: parseList(objectives),
    prerequisites: parseList(prerequisites),
    durationWeeks: Number(durationWeeks) || undefined,
    level,
    department: departmentId,
    topic: topicId,
    price: Number(price) || 0,
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully.",
    data: course
  });
};

export const listCourses = async (req, res) => {
  const filter = { status: "PUBLISHED" };
  if (req.query.departmentId) filter.department = req.query.departmentId;
  if (req.query.topicId) filter.topic = req.query.topicId;

  const courses = await CourseModel.find(filter)
    .populate("department", "name")
    .populate("topic", "title")
    .select("title slug description level price durationWeeks thumbnail enrollmentCount status")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: courses });
};

export const getCourse = async (req, res) => {
  const course = await CourseModel.findById(req.params.courseId)
    .populate("department", "name slug")
    .populate("topic", "title code")
    .populate("createdBy", "name username");

  if (!course) {
    return res.status(404).json({ success: false, message: "Course not found." });
  }

  res.json({ success: true, data: course });
};

export const updateCourse = async (req, res) => {
  const payload = { ...req.body };
  if (payload.objectives) payload.objectives = parseList(payload.objectives);
  if (payload.prerequisites) payload.prerequisites = parseList(payload.prerequisites);
  if (payload.durationWeeks) payload.durationWeeks = Number(payload.durationWeeks);
  if (payload.price) payload.price = Number(payload.price);

  const updated = await CourseModel.findByIdAndUpdate(
    req.params.courseId,
    payload,
    { new: true }
  );

  res.json({ success: true, message: "Course updated.", data: updated });
};

export const approveCourse = async (req, res) => {
  const updated = await CourseModel.findByIdAndUpdate(
    req.params.courseId,
    { status: req.body.status },
    { new: true }
  );
  res.json({ success: true, message: "Course status updated.", data: updated });
};

export const enrolCourse = async (req, res) => {
  const { courseId } = req.params;

  const enrollment = await EnrollmentModel.findOneAndUpdate(
    { course: courseId, user: req.user.id },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await CourseModel.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

  res.status(201).json({
    success: true,
    message: "Enrolled successfully.",
    data: enrollment
  });
};