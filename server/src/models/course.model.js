// src/models/course.model.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    objectives: [String],
    prerequisites: [String],
    durationWeeks: Number,
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    thumbnail: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["DRAFT", "PENDING", "PUBLISHED"],
      default: "PENDING"
    },
    price: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
    syllabusPdfUrl: String,
    syllabusPdfId: String
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", description: "text" });

const CourseModel = mongoose.model("Course", courseSchema);
export default CourseModel;