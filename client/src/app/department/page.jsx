"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { callSummaryApi } from "../../lib/apiClient.js";
import SummaryApi from "../../lib/SummaryApi.js";
import Link from "next/link";

async function fetchDepartments() {
  return callSummaryApi(SummaryApi.departments.list);
}

async function fetchTopics(departmentId) {
  return callSummaryApi(SummaryApi.topics.list, {
    params: departmentId ? { departmentId } : undefined
  });
}

export default function DepartmentsIndexPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const depQuery = useQuery({ queryKey: ["deps"], queryFn: fetchDepartments });
  const departments = depQuery.data?.data ?? [];

  const topicsQuery = useQuery({
    queryKey: ["topics", selected],
    queryFn: () => fetchTopics(selected),
    enabled: !isMobile
  });
  const topics = topicsQuery.data?.data ?? [];

  const filteredDeps = useMemo(() => {
    const list = departments;
    if (!search) return list;
    const s = search.toLowerCase();
    return list.filter((d) => d.name?.toLowerCase().includes(s));
  }, [departments, search]);

  const handleDepartmentClick = (department) => {
    if (!department) return;
    if (isMobile) {
      router.push(`/departments/${department.slug ?? department._id}`);
      return;
    }
    setSelected(department._id);
  };

  const activeDepartment = departments.find((d) => d._id === selected) ?? null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">Departments</h1>
      <div className="grid gap-6 md:grid-cols-[280px,1fr]">
        <Card className="space-y-4">
          <Input
            label="Search"
            placeholder="Search departments"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {depQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader /> Loading departments…
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredDeps.map((d) => {
                const active = !isMobile && selected ? selected === d._id : false;
                return (
                  <li key={d._id}>
                    <button
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                        active ? "bg-teal-600 text-white" : "hover:bg-teal-50 text-slate-700"
                      }`}
                      onClick={() => handleDepartmentClick(d)}
                    >
                      {d.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="overflow-x-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">
              {activeDepartment?.name || "All Topics"}
            </h2>
            {activeDepartment && !isMobile && (
              <Link
                href={`/departments/${activeDepartment.slug ?? activeDepartment._id}`}
                className="text-sm font-semibold text-teal-700 hover:underline"
              >
                Open department page →
              </Link>
            )}
          </div>

          {isMobile ? (
            <p className="mt-6 text-sm text-slate-500">
              Tap a department to view its topics on a dedicated page.
            </p>
          ) : topicsQuery.isLoading ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
              <Loader /> Loading topics…
            </div>
          ) : !topics.length ? (
            <p className="mt-6 text-sm text-slate-500">No topics found.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">CODE</th>
                    <th className="px-4 py-3">PROJECT TITLE</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map((t) => (
                    <tr key={t._id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-semibold">{t.code}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/topics/${t.slug ?? t._id}`}
                          className="text-teal-700 hover:underline"
                        >
                          {t.title}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}