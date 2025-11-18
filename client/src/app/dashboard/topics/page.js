"use client";

import { useEffect, useMemo, useState, useId } from "react";
import { Plus, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import DOMPurify from "isomorphic-dompurify";
import { decode } from "he";

import Card from "@/components/ui/Card.jsx";
import Input from "@/components/ui/Input.jsx";
import Select from "@/components/ui/Select.jsx";
import Button from "@/components/ui/Button.jsx";
import RichTextEditor from "@/components/ui/RichTextEditor.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import { callSummaryApi } from "@/lib/apiClient";
import SummaryApi from "@/lib/SummaryApi";
import { formatDate, normalizeError } from "@/lib/utils";
import useRequireRole from "@/hooks/useRequireRole.js";

const INITIAL_TOPIC_FORM = {
  title: "",
  code: "",
  departmentId: "",
  summary: "",
  keywords: ""
};

const PURIFY_CONFIG = {
  USE_PROFILES: { html: true },
  ADD_ATTR: ["data-list", "data-checked", "data-indent"],
  ADD_TAGS: ["span"]
};

function decodeAndSanitizeHtml(input, { sanitize = false } = {}) {
  if (!input) return "";
  const decoded = decode(input);
  return sanitize ? DOMPurify.sanitize(decoded, PURIFY_CONFIG) : decoded;
}

async function fetchTopics(params) {
  return callSummaryApi(SummaryApi.topics.list, {
    params: params.departmentId ? { departmentId: params.departmentId } : undefined
  });
}

async function fetchDepartments() {
  return callSummaryApi(SummaryApi.departments.list);
}

function TopicFormModal({
  open,
  onClose,
  onSubmit,
  formState,
  setFormState,
  departments,
  isSaving,
  editing
}) {
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-start justify-center px-4 pb-10 pt-16 sm:items-center sm:p-8">
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          aria-describedby={dialogDescriptionId}
          className="relative z-10 w-full max-w-3xl"
        >
          <Card
            as="form"
            onSubmit={onSubmit}
            className="relative flex h-full max-h-[calc(100vh-4rem)] w-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl sm:max-h-[min(840px,calc(100vh-3rem))]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:right-6 sm:top-6"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close topic form</span>
            </button>

            <div className="modal-scroll-area flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Topic title"
                  value={formState.title}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="e.g. Emerging Climate Adaptation Frameworks"
                  required
                  autoFocus
                />
                <Input
                  label="Topic code"
                  value={formState.code}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, code: event.target.value }))
                  }
                  placeholder="e.g. RG-CHM-102"
                  required
                />
                <Select
                  label="Department"
                  value={formState.departmentId}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, departmentId: event.target.value }))
                  }
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Keywords"
                  placeholder="Separate with commas (e.g. health, epidemiology, policy)"
                  value={formState.keywords}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, keywords: event.target.value }))
                  }
                />
                <RichTextEditor
                  className="sm:col-span-2"
                  label="Summary"
                  placeholder="Provide a concise overview of the topic’s scope and expected research outputs."
                  value={formState.summary}
                  onChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      summary: value
                    }))
                  }
                  hint="Use headings, bullet points, and links sparingly for clarity."
                />
              </div>
            </div>

            <footer className="border-t border-slate-100 bg-slate-50/70 px-6 py-2 sm:px-8 sm:py-1">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSaving}
                  className="w-full justify-center sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full justify-center sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <Loader size="sm" />
                      Saving…
                    </>
                  ) : editing ? (
                    "Update topic"
                  ) : (
                    "Create topic"
                  )}
                </Button>
              </div>
            </footer>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function TopicsPage() {
  useRequireRole("ADMIN");
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({ departmentId: "" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState(() => ({ ...INITIAL_TOPIC_FORM }));
  const [editing, setEditing] = useState(null);

  const resetFormState = () => setFormState(() => ({ ...INITIAL_TOPIC_FORM }));
  const closeForm = () => {
    setIsFormOpen(false);
    setEditing(null);
    resetFormState();
  };

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isFormOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isFormOpen]);

  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments
  });

  const topicsQuery = useQuery({
    queryKey: ["topics", filters.departmentId],
    queryFn: () => fetchTopics(filters)
  });

  const createMutation = useMutation({
    mutationFn: (payload) =>
      callSummaryApi(SummaryApi.topics.create, { payload }),
    onSuccess: () => {
      toast.success("Topic created.");
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      closeForm();
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      callSummaryApi(SummaryApi.topics.update(id), { payload }),
    onSuccess: () => {
      toast.success("Topic updated.");
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      closeForm();
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => callSummaryApi(SummaryApi.topics.remove(id)),
    onSuccess: () => {
      toast.success("Topic deleted.");
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const topics = useMemo(() => topicsQuery.data?.data ?? [], [topicsQuery.data?.data]);
  const departments = useMemo(
    () => departmentsQuery.data?.data ?? [],
    [departmentsQuery.data?.data]
  );

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanedSummary = formState.summary?.trim();
    const hasContent = cleanedSummary && cleanedSummary !== "<p><br></p>";
    const safeSummary = hasContent
      ? DOMPurify.sanitize(cleanedSummary, PURIFY_CONFIG)
      : "";

    const payload = {
      title: formState.title,
      code: formState.code,
      departmentId: formState.departmentId,
      summary: safeSummary,
      keywords: formState.keywords
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    if (editing) {
      updateMutation.mutate({ id: editing._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const openCreateModal = () => {
    setEditing(null);
    resetFormState();
    setIsFormOpen(true);
  };

  const startEdit = (topic) => {
    setEditing(topic);
    setFormState({
      title: topic.title,
      code: topic.code,
      departmentId: topic.department?._id ?? topic.department ?? "",
      summary: decodeAndSanitizeHtml(topic.summary ?? ""),
      keywords: (topic.keywords ?? []).join(", ")
    });
    setIsFormOpen(true);
  };

  const isLoadingTopics = topicsQuery.isLoading;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Research taxonomy
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Topics</h1>
        <p className="text-sm text-slate-600">
          Curate topics per department, assign codes, and keep summaries aligned with your research strategy.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Card className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
          <Select
            label="Filter by department"
            value={filters.departmentId}
            onChange={(event) => setFilters({ departmentId: event.target.value })}
          >
            <option value="">All departments</option>
            {departments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.name}
              </option>
            ))}
          </Select>
          <span className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600">
            Topics found: {topics.length}
          </span>
        </Card>

        <Button onClick={openCreateModal} className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New topic
        </Button>
      </div>

      <TopicFormModal
        open={isFormOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        formState={formState}
        setFormState={setFormState}
        departments={departments}
        isSaving={isSaving}
        editing={editing}
      />

      {isLoadingTopics ? (
        <Card className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
          <Loader />
          Loading topics…
        </Card>
      ) : topics.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
          <h3 className="text-base font-semibold text-slate-800">No topics yet</h3>
          <p>
            Start by creating a topic for your first department. You can always edit or add summaries later.
          </p>
          <Button onClick={openCreateModal} size="sm" className="mt-2">
            <Plus className="mr-2 h-4 w-4" />
            Create topic
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((topic) => {
            const summaryHtml = decodeAndSanitizeHtml(topic.summary ?? "", { sanitize: true });
            return (
              <Card
                key={topic._id}
                className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-900">{topic.title}</h3>
                    <p className="text-xs text-slate-500">
                      Code {topic.code} · Department {topic.department?.name ?? "—"}
                    </p>
                  </div>
                  {topic.status && (
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                      {topic.status}
                    </span>
                  )}
                </div>

                {summaryHtml ? (
                  <div
                    className="topic-summary"
                    dangerouslySetInnerHTML={{ __html: summaryHtml }}
                  />
                ) : (
                  <p className="text-sm text-slate-500">No summary provided yet.</p>
                )}

                {(topic.keywords ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs text-indigo-600">
                    {topic.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-indigo-50 px-3 py-1 font-semibold"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <span>Created {formatDate(topic.createdAt)}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => startEdit(topic)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (!window.confirm(`Delete topic “${topic.title}”?`)) return;
                      deleteMutation.mutate(topic._id);
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}