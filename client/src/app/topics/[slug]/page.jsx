"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { decode } from "he";

import Card from "../../../components/ui/Card.jsx";
import { Loader } from "../../../components/ui/Loader.jsx";
import { callSummaryApi } from "../../../lib/apiClient.js";
import SummaryApi from "../../../lib/SummaryApi.js";

const PURIFY_CONFIG = {
  USE_PROFILES: { html: true },
  ADD_ATTR: ["data-list", "data-checked", "data-indent"],
  ADD_TAGS: ["span"]
};

async function fetchTopics() {
  return callSummaryApi(SummaryApi.topics.list);
}

async function fetchArticles(topicId) {
  return callSummaryApi(SummaryApi.articles.list, {
    params: { topicId, status: "PUBLISHED" }
  });
}

export default function TopicDetailPage() {
  const { slug } = useParams();

  const topicsQuery = useQuery({ queryKey: ["topics"], queryFn: fetchTopics });
  const topic = useMemo(() => {
    const list = topicsQuery.data?.data ?? [];
    return list.find((t) => t.slug === slug || t._id === slug) ?? null;
  }, [topicsQuery.data?.data, slug]);

  const articlesQuery = useQuery({
    queryKey: ["articles", topic?._id],
    queryFn: () => fetchArticles(topic?._id),
    enabled: Boolean(topic?._id)
  });

  const sanitizedSummary = useMemo(() => {
    if (!topic?.summary) return "";
    const decoded = decode(topic.summary);
    return DOMPurify.sanitize(decoded, PURIFY_CONFIG);
  }, [topic?.summary]);

  if (!topic) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        {topicsQuery.isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader /> Loading topic…
          </div>
        ) : (
          <p className="text-sm text-rose-600">Topic not found.</p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <h1 className="mb-2 text-center text-2xl font-bold text-slate-800">{topic.title}</h1>
      <p className="mb-6 text-center text-xs font-semibold tracking-wider text-slate-500">
        PROJECT DETAILS
      </p>

      <div className="grid gap-6 md:grid-cols-[280px,1fr]">
        <Card>
          <h3 className="mb-3 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
            Project Details
          </h3>
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Department:</span>{" "}
              {topic.department?.name ?? "—"}
            </p>
            <p>
              <span className="font-semibold">Project ID:</span> {topic.code}
            </p>
            {Array.isArray(topic.keywords) && topic.keywords.length > 0 && (
              <p className="flex flex-wrap gap-2">
                <span className="font-semibold">Keywords:</span>
                {topic.keywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs"
                  >
                    {k}
                  </span>
                ))}
              </p>
            )}
          </div>
        </Card>

        <Card className="product-description-content">
          {/* <h2 className="text-xl font-bold text-slate-800">STATEMENT OF THE PROBLEM</h2> */}
          <div className="mt-3 rich-text-content">
            {sanitizedSummary ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizedSummary }} />
            ) : (
              <p className="text-sm leading-7 text-slate-700">
                No abstract provided for this topic yet.
              </p>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-base font-semibold text-slate-800">Published Articles</h3>
            {articlesQuery.isLoading ? (
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <Loader /> Loading…
              </div>
            ) : !articlesQuery.data?.data?.length ? (
              <p className="mt-3 text-sm text-slate-500">
                No published manuscripts for this topic yet. Contact us for more
                information or hire a writer{" "}
                <a href="/contact" className="text-teal-600 hover:underline">
                  reach out
                </a>
                .
              </p>
            ) : (
              <ul className="mt-4 list-disc pl-5 text-sm text-teal-700">
                {articlesQuery.data.data.map((a) => (
                  <li key={a._id} className="hover:underline">
                    {a.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}