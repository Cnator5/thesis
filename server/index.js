// index.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./src/config/connectDB.js";
import limiter from "./src/middleware/limiter.js";
import errorHandler from "./src/middleware/errorHandler.js";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import departmentRoutes from "./src/routes/department.routes.js";
import topicRoutes from "./src/routes/topic.routes.js";
import articleRoutes from "./src/routes/article.routes.js";
import courseRoutes from "./src/routes/course.routes.js";
import lessonRoutes from "./src/routes/lesson.routes.js";
import bookRoutes from "./src/routes/book.routes.js";
import borrowRoutes from "./src/routes/borrow.routes.js";
import searchRoutes from "./src/routes/search.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";

import "./src/jobs/overdueScanner.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL ?? "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    credentials: true
  })
);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));
app.use(compression());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", limiter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Research Guru API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});