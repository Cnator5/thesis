// components/books/BookCard.jsx
"use client";

import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import StatusBadge from "@/components/ui/StatusBadge.jsx";
import { formatDate } from "@/lib/utils";

export default function BookCard({ book, onEdit, onDelete, isAdmin }) {
  return (
    <Card className="flex h-full flex-col gap-4 rounded-3xl border border-slate-100 bg-white/95 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{book.title}</h3>
          <p className="text-xs text-slate-500">
            {Array.isArray(book.authors) ? book.authors.join(", ") : book.authors ?? "Unknown author"}
          </p>
        </div>
        <StatusBadge status={book.status ?? "AVAILABLE"} />
      </div>

      <p className="text-sm text-slate-600 line-clamp-3">{book.summary || "No summary available."}</p>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {book.isbn && <span>ISBN {book.isbn}</span>}
        <span>Copies {book.copiesAvailable ?? 0}/{book.copiesOwned ?? book.copiesAvailable ?? 0}</span>
        {book.location && <span>Location {book.location}</span>}
        {book.publishYear && <span>Published {book.publishYear}</span>}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {book.department?.name && (
          <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-600">
            {book.department.name}
          </span>
        )}
        {book.topic?.title && (
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
            {book.topic.title}
          </span>
        )}
        {(book.tags ?? []).slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-600">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between text-xs text-slate-500">
        <span>Created {formatDate(book.createdAt)}</span>
        {book.documentUrl && (
          <a
            href={book.documentUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            View digital copy
          </a>
        )}
      </div>

      {isAdmin && (
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => onEdit(book)} className="flex-1">
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(book)} className="flex-1">
            Delete
          </Button>
        </div>
      )}
    </Card>
  );
}