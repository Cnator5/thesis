// src/controllers/dashboard.controller.js
import ArticleModel from "../models/article.model.js";
import CourseModel from "../models/course.model.js";
import EnrollmentModel from "../models/enrollment.model.js";
import BorrowModel from "../models/borrow.model.js";

export const studentDashboard = async (req, res) => {
  const [enrollments, borrows] = await Promise.all([
    EnrollmentModel.find({ user: req.user.id })
      .populate("course", "title thumbnail status"),
    BorrowModel.find({ user: req.user.id, status: { $ne: "RETURNED" } })
      .populate("book", "title coverImage dueAt status")
  ]);

  res.json({
    success: true,
    data: {
      enrollments,
      borrows
    }
  });
};

export const instructorDashboard = async (req, res) => {
  const [courses, articles] = await Promise.all([
    CourseModel.find({ createdBy: req.user.id }),
    ArticleModel.find({ author: req.user.id })
  ]);

  res.json({
    success: true,
    data: {
      courses,
      articles
    }
  });
};

export const adminDashboard = async (_req, res) => {
  const [pendingArticles, pendingCourses, activeBorrows] = await Promise.all([
    ArticleModel.countDocuments({ status: "PENDING" }),
    CourseModel.countDocuments({ status: "PENDING" }),
    BorrowModel.countDocuments({ status: "BORROWED" })
  ]);

  res.json({
    success: true,
    data: {
      pendingArticles,
      pendingCourses,
      activeBorrows
    }
  });
};