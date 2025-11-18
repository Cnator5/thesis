// src/controllers/search.controller.js
import ArticleModel from "../models/article.model.js";
import CourseModel from "../models/course.model.js";
import BookModel from "../models/book.model.js";

export const globalSearch = async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({ success: false, message: "Query keyword is required." });
  }

  const [articles, courses, books] = await Promise.all([
    ArticleModel.find({ $text: { $search: keyword }, status: "PUBLISHED" })
      .select("title slug abstract tags previewPageLimit")
      .limit(10),
    CourseModel.find({ $text: { $search: keyword }, status: "PUBLISHED" })
      .select("title slug description level"),
    BookModel.find({ $text: { $search: keyword } })
      .select("title authors coverImage")
      .limit(10)
  ]);

  res.json({ success: true, data: { articles, courses, books } });
};