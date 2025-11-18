// app/(dashboard)/articles/page.js
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button.jsx";
import Card from "@/components/ui/Card.jsx";
import Input from "@/components/ui/Input.jsx";
import Select from "@/components/ui/Select.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import ArticleForm from "@/components/articles/ArticleForm.jsx";
import ArticleList from "@/components/articles/ArticleList.jsx";
import ArticlePreviewModal from "@/components/articles/ArticlePreviewModal.jsx";
import { callSummaryApi } from "@/lib/apiClient";
import SummaryApi from "@/lib/SummaryApi";
import { normalizeError, isAdmin, isResearcher } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider.jsx";

async function fetchDepartments() {
  return callSummaryApi(SummaryApi.departments.list);
}

async function fetchTopics() {
  return callSummaryApi(SummaryApi.topics.list);
}

async function fetchArticles(filters, isAdminRole) {
  if (isAdminRole) {
    return callSummaryApi(SummaryApi.articles.adminList, {
      params: filters.status ? { status: filters.status } : undefined
    });
  }
  return callSummaryApi(SummaryApi.articles.list, {
    params: {
      departmentId: filters.departmentId || undefined,
      topicId: filters.topicId || undefined,
      status: filters.status || undefined,
      keyword: filters.keyword || undefined
    }
  });
}

export default function ArticlesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const admin = isAdmin(user);
  const researcher = isResearcher(user);

  const [filters, setFilters] = useState({
    departmentId: "",
    topicId: "",
    status: admin ? "" : "PUBLISHED",
    keyword: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [previewArticle, setPreviewArticle] = useState(null);

  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments
  });

  const topicsQuery = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics
  });

  const articlesQuery = useQuery({
    queryKey: ["articles", filters, admin],
    queryFn: () => fetchArticles(filters, admin)
  });

  const previewQuery = useMutation({
    mutationFn: (articleId) => callSummaryApi(SummaryApi.articles.preview(articleId)),
    onSuccess: (data) => setPreviewArticle(data?.data ?? null),
    onError: (error) => toast.error(normalizeError(error))
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      callSummaryApi(SummaryApi.articles.updateStatus(id), { payload: { status } }),
    onSuccess: () => {
      toast.success("Article status updated.");
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const createMutation = useMutation({
    mutationFn: (formData) =>
      callSummaryApi(SummaryApi.articles.create, { payload: formData }),
    onSuccess: () => {
      toast.success("Article submitted for review.");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const articles = useMemo(() => {
    const list = articlesQuery.data?.data ?? [];
    if (!admin && researcher) {
      return list;
    }
    if (admin) {
      return list;
    }
    return list;
  }, [articlesQuery.data?.data, admin, researcher]);

  const departments = departmentsQuery.data?.data ?? [];
  const topics = topicsQuery.data?.data ?? [];

  const filteredTopics = useMemo(() => {
    if (!filters.departmentId) return topics;
    return topics.filter((topic) => topic.department?._id === filters.departmentId || topic.department === filters.departmentId);
  }, [filters.departmentId, topics]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Manuscript hub
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Articles & research projects
          </h1>
          <p className="text-sm text-slate-600">
            Submit articles for editorial review, track downloads, and publish premium research briefs.
          </p>
        </div>
        {(researcher || admin) && (
          <Button onClick={() => setShowForm(true)}>Submit new article</Button>
        )}
      </header>

      <Card className="grid gap-4 md:grid-cols-4">
        <Select
          label="Department"
          value={filters.departmentId}
          onChange={(event) => handleFilterChange("departmentId", event.target.value)}
        >
          <option value="">All departments</option>
          {departments.map((department) => (
            <option key={department._id} value={department._id}>
              {department.name}
            </option>
          ))}
        </Select>

        <Select
          label="Topic"
          value={filters.topicId}
          onChange={(event) => handleFilterChange("topicId", event.target.value)}
        >
          <option value="">All topics</option>
          {filteredTopics.map((topic) => (
            <option key={topic._id} value={topic._id}>
              {topic.title}
            </option>
          ))}
        </Select>

        <Select
          label="Status"
          value={filters.status}
          onChange={(event) => handleFilterChange("status", event.target.value)}
        >
          <option value="">Any status</option>
          <option value="PUBLISHED">Published</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
          <option value="DRAFT">Draft</option>
        </Select>

        <Input
          label="Search keyword"
          placeholder="Find by title or abstract"
          value={filters.keyword}
          onChange={(event) => handleFilterChange("keyword", event.target.value)}
        />
      </Card>

      {articlesQuery.isLoading ? (
        <Card className="flex items-center gap-3 text-sm text-slate-500">
          <Loader />
          Fetching articles…
        </Card>
      ) : !articles.length ? (
        <Card className="text-sm text-slate-500">
          No articles found for the selected filters. Adjust your filters or submit a manuscript.
        </Card>
      ) : (
        <ArticleList
          articles={articles}
          isAdmin={admin}
          onPreview={(article) => previewQuery.mutate(article._id)}
          onStatusChange={(article, status) =>
            statusMutation.mutate({ id: article._id, status })
          }
        />
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Submit a new article
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-slate-500 hover:text-rose-500"
              >
                Close
              </button>
            </div>
            <ArticleForm
              departments={departments}
              topics={topics}
              loading={createMutation.isPending}
              onSubmit={(formData) => createMutation.mutate(formData)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {previewArticle && (
        <ArticlePreviewModal
          article={previewArticle}
          onClose={() => setPreviewArticle(null)}
          onDownload={async () => {
            try {
              await callSummaryApi(SummaryApi.articles.download(previewArticle.id));
              toast.success("Download link unlocked. Check your downloads.");
            } catch (error) {
              toast.error(normalizeError(error));
            }
          }}
        />
      )}
    </div>
  );
}