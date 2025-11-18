// src/controllers/borrow.controller.js
import dayjs from "dayjs";
import BorrowModel from "../models/borrow.model.js";
import BookModel from "../models/book.model.js";
import UserModel from "../models/user.model.js";
import { calculateFine } from "../utils/fineCalculator.js";
import transporter from "../config/mailer.js";
import { overdueReminderTemplate } from "../utils/emailTemplates.js";

export const recordBorrowBook = async (req, res) => {
  const { userId, bookId, dueAt, notes } = req.body;

  const [user, book] = await Promise.all([
    UserModel.findById(userId),
    BookModel.findById(bookId)
  ]);

  if (!user || !book) {
    return res.status(404).json({ success: false, message: "User or book not found." });
  }

  if (book.copiesAvailable <= 0) {
    return res.status(400).json({ success: false, message: "Book currently unavailable." });
  }

  const borrow = await BorrowModel.create({
    user: userId,
    book: bookId,
    issuedBy: req.user.id,
    dueAt,
    notes
  });

  book.copiesAvailable -= 1;
  await book.save();

  res.status(201).json({
    success: true,
    message: "Borrow recorded successfully.",
    data: borrow
  });
};

export const returnBorrowBook = async (req, res) => {
  const { borrowId, returnedAt } = req.body;

  const borrow = await BorrowModel.findById(borrowId).populate("book");
  if (!borrow) {
    return res.status(404).json({ success: false, message: "Borrow record not found." });
  }

  if (borrow.status === "RETURNED") {
    return res.status(400).json({ success: false, message: "Book already returned." });
  }

  const fine = calculateFine(borrow.dueAt, returnedAt);

  borrow.returnedAt = returnedAt;
  borrow.fineAccrued = fine;
  borrow.status = fine > 0 ? "OVERDUE" : "RETURNED";
  await borrow.save();

  await BookModel.findByIdAndUpdate(borrow.book._id, { $inc: { copiesAvailable: 1 } });

  res.json({
    success: true,
    message: "Return recorded.",
    data: borrow
  });
};

export const borrowedBooks = async (req, res) => {
  const borrows = await BorrowModel.find({ user: req.user.id, status: { $ne: "RETURNED" } })
    .populate("book", "title authors coverImage")
    .sort({ dueAt: 1 });

  res.json({ success: true, data: borrows });
};

export const getBorrowedByAdmin = async (_req, res) => {
  const borrows = await BorrowModel.find()
    .populate("book", "title")
    .populate("user", "name email phone")
    .populate("issuedBy", "name");

  res.json({ success: true, data: borrows });
};

export const notifyOverdue = async ({ borrow, fine }) => {
  if (!borrow) return;

  const user = await UserModel.findById(borrow.user);
  const book = await BookModel.findById(borrow.book);

  if (!user || !book) return;

  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? "Research Guru <no-reply@researchguru.pro>",
    to: user.email,
    subject: "Overdue book reminder",
    html: overdueReminderTemplate({
      name: user.name,
      bookTitle: book.title,
      dueAt: dayjs(borrow.dueAt).format("DD MMM YYYY"),
      fineEstimate: fine
    })
  });
};