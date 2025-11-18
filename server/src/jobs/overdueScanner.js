// src/jobs/overdueScanner.js
import cron from "node-cron";
import BorrowModel from "../models/borrow.model.js";
import { calculateFine } from "../utils/fineCalculator.js";
import { notifyOverdue } from "../controllers/borrow.controller.js";

const TIMEZONE = process.env.CRON_TIMEZONE || "Africa/Douala";

cron.schedule(
  "0 8 * * *",
  async () => {
    console.log("🔔 Running overdue scanner job...");
    const overdues = await BorrowModel.find({
      status: "BORROWED",
      dueAt: { $lt: new Date() }
    });

    for (const overdue of overdues) {
      const fine = calculateFine(overdue.dueAt, new Date());
      overdue.status = "OVERDUE";
      overdue.fineAccrued = fine;
      await overdue.save();
      await notifyOverdue({ borrow: overdue, fine });
    }
  },
  { timezone: TIMEZONE }
);