// src/models/book.model.js
import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    isbn: { type: String, unique: true, sparse: true },
    authors: [{ type: String }],
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
    categories: [{ type: String }],
    summary: String,
    tags: [{ type: String, lowercase: true }],
    coverImage: String,
    documentUrl: String,
    documentPublicId: String,
    copiesOwned: { type: Number, default: 1 },
    copiesAvailable: { type: Number, default: 1 },
    location: String,
    publishYear: Number,
    status: {
      type: String,
      enum: ["AVAILABLE", "MAINTENANCE", "ARCHIVED"],
      default: "AVAILABLE"
    }
  },
  { timestamps: true }
);

bookSchema.index({ title: "text", authors: "text", tags: 1 });

const BookModel = mongoose.model("Book", bookSchema);
export default BookModel;