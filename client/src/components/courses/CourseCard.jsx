// components/courses/CourseCard.jsx
"use client";

import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import StatusBadge from "@/components/ui/StatusBadge.jsx";
import { formatCurrency } from "@/lib/utils";

export default function CourseCard({
  course,
  canReview,
  canEnroll,
  onApprove,
  onReject,
  onEnroll
}) {
  return (
    <Card className="flex h-full flex-col gap-4 rounded-3xl border border-slate-100 bg-white/95 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
          <p className="text-xs text-slate-500">{course.level} • {course.durationWeeks ?? "—"} weeks</p>
        </div>
        <StatusBadge status={course.status ?? "PUBLISHED"} />
      </div>

      <p className="text-sm text-slate-600 line-clamp-3">{course.description}</p>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {course.department?.name && (
          <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-600">
            {course.department.name}
          </span>
        )}
        {course.topic?.title && (
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
            {course.topic.title}
          </span>
        )}
        <span>
          Price:{" "}
          {course.price
            ? `${formatCurrency(course.price, "XAF")} / ${course.price.toLocaleString()} XAF`
            : "Free"}
        </span>
      </div>

      <div className="mt-auto flex gap-3">
        {canEnroll && (
          <Button size="sm" onClick={onEnroll}>
            Enrol now
          </Button>
        )}
        {canReview && (
          <>
            <Button size="sm" variant="secondary" onClick={onApprove}>
              Publish
            </Button>
            <Button size="sm" variant="ghost" onClick={onReject}>
              Reject
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}