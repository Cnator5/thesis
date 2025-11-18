// src/models/borrow.model.js
import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    borrowedAt: { type: Date, default: Date.now },
    dueAt: { type: Date, required: true },
    returnedAt: Date,
    fineAccrued: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["BORROWED", "RETURNED", "OVERDUE"],
      default: "BORROWED"
    },
    notes: String
  },
  { timestamps: true }
);

borrowSchema.index({ user: 1, status: 1 });

const BorrowModel = mongoose.model("Borrow", borrowSchema);
export default BorrowModel;