// src/models/lesson.model.js
import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 1 },
    content: String,
    videoUrl: String,
    resources: [{ type: String }],
    previewable: { type: Boolean, default: false }
  },
  { timestamps: true }
);

lessonSchema.index({ course: 1, order: 1 });

const LessonModel = mongoose.model("Lesson", lessonSchema);
export default LessonModel;