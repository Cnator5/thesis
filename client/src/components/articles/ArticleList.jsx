// components/articles/ArticleList.jsx
"use client";

import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import StatusBadge from "@/components/ui/StatusBadge.jsx";
import { formatDate } from "@/lib/utils";

const ADMIN_ACTIONS = ["PUBLISHED", "REJECTED"];

export default function ArticleList({ articles, isAdmin, onPreview, onStatusChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <Card key={article._id} className="flex h-full flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-slate-500">Project {article.projectCode}</p>
              <h3 className="text-lg font-semibold text-slate-900">
                {article.title}
              </h3>
            </div>
            <StatusBadge status={article.status} />
          </div>
          <p className="text-sm text-slate-600 line-clamp-4">{article.abstract}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {article.department?.name && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-600">
                {article.department.name}
              </span>
            )}
            {article.topic?.title && (
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
                {article.topic.title}
              </span>
            )}
            <span>Preview pages: {article.previewPageLimit}</span>
            <span>Views: {article.viewCount ?? 0}</span>
            <span>Downloads: {article.downloadCount ?? 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{formatDate(article.createdAt)}</span>
            <span>{article.allowDownload ? "Download enabled" : "Preview only"}</span>
          </div>
          <div className="mt-auto flex flex-wrap gap-3">
            <Button size="sm" variant="primary" onClick={() => onPreview(article)}>
              Preview
            </Button>
            {isAdmin &&
              ADMIN_ACTIONS.map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={status === "PUBLISHED" ? "secondary" : "ghost"}
                  onClick={() => onStatusChange(article, status)}
                >
                  Mark {status.toLowerCase()}
                </Button>
              ))}
          </div>
        </Card>
      ))}
    </div>
  );
}