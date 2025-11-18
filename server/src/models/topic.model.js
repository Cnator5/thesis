// src/models/topic.model.js
import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    summary: String,
    keywords: [{ type: String, lowercase: true }],
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

topicSchema.index({ title: "text", keywords: 1 });

const TopicModel = mongoose.model("Topic", topicSchema);
export default TopicModel;