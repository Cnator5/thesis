// components/articles/ArticlePreviewModal.jsx
"use client";

import Button from "@/components/ui/Button.jsx";
import Card from "@/components/ui/Card.jsx";
import { formatCurrency } from "@/lib/utils";

export default function ArticlePreviewModal({ article, onClose, onDownload }) {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Project {article.projectCode}</p>
            <h2 className="text-2xl font-semibold text-slate-900">{article.title}</h2>
            <p className="text-xs text-slate-500">
              {article.department?.name} • {article.topic?.title}
            </p>
          </div>
          <button
            className="text-sm text-slate-500 hover:text-rose-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
          {article.abstract}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span>Total pages {article.totalPages ?? "—"}</span>
          <span>Preview sections {article.previewSections?.length ?? 0}</span>
          <span>Views {article.viewCount ?? 0}</span>
          <span>Downloads {article.downloadCount ?? 0}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
          {article.priceLocal !== undefined && (
            <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-600">
              Local price {article.priceLocal.toLocaleString()} XAF
            </span>
          )}
          {article.priceInternational !== undefined && (
            <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-600">
              International {formatCurrency(article.priceInternational, "USD")}
            </span>
          )}
          <span>{article.allowDownload ? "Download enabled" : "Preview only"}</span>
        </div>

        <div className="mt-6 space-y-4">
          {(article.previewSections ?? []).map((section) => (
            <Card key={section.pageNumber} className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Page {section.pageNumber}</span>
                {section.heading && (
                  <span className="font-semibold text-indigo-500">{section.heading}</span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                {section.content}
              </p>
            </Card>
          ))}
          {!article.previewSections?.length && (
            <Card className="text-sm text-slate-500">
              Preview unavailable for this manuscript.
            </Card>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {article.allowDownload && (
            <Button onClick={onDownload}>Unlock download</Button>
          )}
        </div>
      </div>
    </div>
  );
}