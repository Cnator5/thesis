// src/controllers/lesson.controller.js
import LessonModel from "../models/lesson.model.js";
import CourseModel from "../models/course.model.js";

export const createLesson = async (req, res) => {
  const { courseId, title, order, content, previewable, videoUrl } = req.body;

  const course = await CourseModel.findById(courseId);
  if (!course) return res.status(404).json({ success: false, message: "Course not found" });

  if (String(course.createdBy) !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Not authorised to add lessons" });
  }

  const lesson = await LessonModel.create({
    course: courseId,
    title,
    order,
    content,
    previewable,
    videoUrl,
  });

  res.status(201).json({ success: true, message: "Lesson created", data: lesson });
};

export const listLessons = async (req, res) => {
  const lessons = await LessonModel.find({ course: req.params.courseId }).sort("order");
  res.json({ success: true, data: lessons });
};