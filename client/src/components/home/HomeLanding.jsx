// components/home/HomeLanding.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Microscope, Newspaper, Sparkles, Target } from "lucide-react";
import ResearchTools from "./ResearchTools.jsx";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { callSummaryApi } from "../../lib/apiClient";
import SummaryApi from "../../lib/SummaryApi";
import { formatDate, normalizeError } from "../../lib/utils";
import { toast } from "react-hot-toast";

async function fetchDepartments() {
  return callSummaryApi(SummaryApi.departments.list);
}
async function fetchTopics(departmentId) {
  return callSummaryApi(SummaryApi.topics.list, { params: departmentId ? { departmentId } : undefined });
}
async function fetchArticles(filters) {
  return callSummaryApi(SummaryApi.articles.list, {
    params: {
      departmentId: filters.departmentId || undefined,
      topicId: filters.topicId || undefined,
      status: "PUBLISHED"
    }
  });
}

export default function HomeLanding() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [previewArticle, setPreviewArticle] = useState(null);

  const departmentsQuery = useQuery({ queryKey: ["departments"], queryFn: fetchDepartments });
  const topicsQuery = useQuery({
    queryKey: ["topics", selectedDepartment],
    queryFn: () => fetchTopics(selectedDepartment),
    enabled: Boolean(selectedDepartment)
  });
  const articlesQuery = useQuery({
    queryKey: ["articles", { departmentId: selectedDepartment, topicId: selectedTopic }],
    queryFn: () => fetchArticles({ departmentId: selectedDepartment, topicId: selectedTopic }),
    enabled: Boolean(selectedTopic)
  });

  const departments = departmentsQuery.data?.data ?? [];
  const topics = topicsQuery.data?.data ?? [];
  const articles = articlesQuery.data?.data ?? [];

  useEffect(() => {
    if (departments.length && !selectedDepartment) setSelectedDepartment(departments[0]._id);
  }, [departments, selectedDepartment]);

  useEffect(() => {
    if (!topics.length) { setSelectedTopic(""); return; }
    setSelectedTopic((prev) => topics.some((t) => t._id === prev) ? prev : topics[0]._id);
  }, [topics]);

  const activeTopic = useMemo(() => topics.find((t) => t._id === selectedTopic) ?? null, [topics, selectedTopic]);

  const handlePreview = async (articleId) => {
    try {
      const response = await callSummaryApi(SummaryApi.articles.preview(articleId));
      setPreviewArticle(response?.data ?? null);
    } catch (error) {
      toast.error(normalizeError(error));
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 pb-24 pt-10 md:flex-row md:gap-10">
        <aside className="w-full md:sticky md:top-24 md:w-64 md:self-start">
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
              Departments
            </h2>
            <ul className="mt-5 space-y-2">
              {departments.map((department) => {
                const active = department._id === selectedDepartment;
                return (
                  <li key={department._id}>
                    <button
                      type="button"
                      onClick={() => setSelectedDepartment(department._id)}
                      className={`w-full rounded-xl px-4 py-2 text-left text-sm font-semibold transition ${
                        active
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "border border-transparent text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      {department.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-6 glass-panel rounded-3xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Research toolkit
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3 rounded-2xl border border-slate-100 bg-white/80 px-4 py-3">
                <Sparkles size={16} className="mt-1 text-indigo-500" />
                AI topic discovery briefs in English & French.
              </li>
              <li className="flex gap-3 rounded-2xl border border-slate-100 bg-white/80 px-4 py-3">
                <Microscope size={16} className="mt-1 text-sky-500" />
                Verified datasets & archival references per faculty.
              </li>
              <li className="flex gap-3 rounded-2xl border border-slate-100 bg-white/80 px-4 py-3">
                <GraduationCap size={16} className="mt-1 text-emerald-500" />
                Mentor pairing for postgraduate research.
              </li>
            </ul>
          </div>
        </aside>

        <section className="flex-1 space-y-14">
          <header className="glass-panel relative overflow-hidden rounded-4xl border border-indigo-100 bg-white px-8 py-12 shadow-xl">
            <span className="badge-pill bg-indigo-50 text-indigo-600">
              Research Guru Knowledge Network
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Transform departmental research into actionable intelligence.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-600 md:text-lg">
              From concept ideation to publication-ready manuscripts...
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild><a href="/?auth=register">Create a researcher account</a></Button>
              <a href="/?auth=login" className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-500">Explore your dashboard →</a>
            </div>
          </header>

          <section className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                  Department topics
                </p>
                <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                  {activeTopic ? activeTopic.title : "Select a topic"}
                </h2>
              </div>
              {activeTopic?.code && (
                <span className="rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold text-indigo-600">
                  Topic code: {activeTopic.code}
                </span>
              )}
            </header>

            <div className="grid gap-4 md:grid-cols-3">
              {topics.map((topic) => {
                const active = topic._id === selectedTopic;
                return (
                  <Card
                    key={topic._id}
                    className={`cursor-pointer transition ${
                      active
                        ? "border-indigo-200 bg-indigo-50/80 shadow-lg shadow-indigo-100"
                        : "hover:-translate-y-1 hover:shadow-md"
                    }`}
                    onClick={() => setSelectedTopic(topic._id)}
                  >
                    <div className="flex flex-col gap-3">
                      <h3 className="text-base font-semibold text-slate-900">{topic.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-3">{topic.summary || "No summary provided yet."}</p>
                    </div>
                  </Card>
                );
              })}
            </div>

            {activeTopic && (
              <Card className="space-y-4">
                <header className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Topic overview</p>
                    <h3 className="text-lg font-semibold text-slate-900">{activeTopic.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Target size={16} />
                    <span>Status: {activeTopic.status}</span>
                  </div>
                </header>
                <p className="text-sm leading-relaxed text-slate-600">
                  {activeTopic.summary || "This topic is awaiting a richer abstract from its curator."}
                </p>
              </Card>
            )}
          </section>

          <section className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Published articles</p>
                <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Insight briefs</h2>
              </div>
              <Button variant="secondary" asChild><a href="/articles">Contributor workspace</a></Button>
            </header>

            {articlesQuery.isLoading ? (
              <Card className="text-sm text-slate-500">Loading articles…</Card>
            ) : !articles.length ? (
              <Card className="text-sm text-slate-500">No published manuscripts yet.</Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {articles.map((article) => (
                  <Card key={article._id} className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">{article.title}</h3>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                        Project {article.projectCode}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3">{article.abstract}</p>
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                      <span>Views: {article.viewCount ?? 0}</span>
                      <span>Downloads: {article.downloadCount ?? 0}</span>
                      <span>Published: {formatDate(article.createdAt)}</span>
                    </div>
                    <div className="flex gap-3">
                      <Button size="sm" onClick={() => handlePreview(article._id)}>Preview</Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {previewArticle && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
                <div className="glass-panel relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl p-6">
                  <button className="absolute right-4 top-4 text-sm text-slate-500 hover:text-rose-500" onClick={() => setPreviewArticle(null)}>Close</button>
                  <h3 className="text-2xl font-semibold text-slate-900">{previewArticle.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">Project {previewArticle.projectCode}</p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{previewArticle.abstract}</p>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-6">
            <header className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Continuous learning</p>
              <h2 className="text-3xl font-semibold text-slate-900">Specialist micro-courses</h2>
              <p className="text-base text-slate-600">Our course catalogue empowers supervisors...</p>
            </header>
            <ResearchTools />
          </section>
        </section>
      </main>
    </div>
  );
}