// src/utils/fineCalculator.js
import dayjs from "dayjs";

const DAILY_RATE = Number(process.env.FINE_DAILY_RATE || 300);

export const calculateFine = (dueDate, returnDate = new Date()) => {
  const due = dayjs(dueDate).startOf("day");
  const returned = dayjs(returnDate).startOf("day");
  const diff = returned.diff(due, "day");
  if (diff <= 0) return 0;
  return diff * DAILY_RATE;
};