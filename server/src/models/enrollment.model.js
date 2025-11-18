// src/models/enrollment.model.js
import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    progress: { type: Number, default: 0 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "DROPPED"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const EnrollmentModel = mongoose.model("Enrollment", enrollmentSchema);
export default EnrollmentModel;