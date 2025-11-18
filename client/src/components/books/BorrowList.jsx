// components/books/BorrowList.jsx
"use client";

import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import StatusBadge from "@/components/ui/StatusBadge.jsx";
import { formatDate } from "@/lib/utils";

export default function BorrowList({ records, onReturn, isAdmin }) {
  if (!records?.length) {
    return (
      <Card className="text-center text-sm text-slate-500">
        No borrow records found.
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {records.map((record) => (
        <Card key={record._id} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {record.book?.title ?? "Unknown title"}
              </p>
              <p className="text-xs text-slate-500">
                {Array.isArray(record.book?.authors)
                  ? record.book.authors.join(", ")
                  : record.book?.authors ?? "—"}
              </p>
            </div>
            <StatusBadge status={record.status} />
          </div>

          <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-slate-700">Borrowed on</p>
              <p>{formatDate(record.borrowedAt)}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-700">Due date</p>
              <p>{formatDate(record.dueAt)}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-700">Fine accrued</p>
              <p className={record.fineAccrued > 0 ? "text-rose-500" : undefined}>
                {record.fineAccrued > 0 ? `${record.fineAccrued.toLocaleString()} XAF` : "None"}
              </p>
            </div>
            {record.returnedAt && (
              <div>
                <p className="font-semibold text-slate-700">Returned at</p>
                <p>{formatDate(record.returnedAt)}</p>
              </div>
            )}
            {record.notes && (
              <div className="sm:col-span-3">
                <p className="font-semibold text-slate-700">Notes</p>
                <p>{record.notes}</p>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                <p className="font-semibold text-slate-700">Borrower</p>
                <p>{record.user?.name ?? "—"}</p>
                <p>{record.user?.email ?? "—"}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Issued by</p>
                <p>{record.issuedBy?.name ?? "—"}</p>
              </div>
            </div>
          )}

          {record.status !== "RETURNED" && isAdmin && (
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => onReturn(record)}>
                Mark as returned
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}