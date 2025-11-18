// app/(dashboard)/courses/page.js
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button.jsx";
import Card from "@/components/ui/Card.jsx";
import Select from "@/components/ui/Select.jsx";
import Input from "@/components/ui/Input.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import CourseForm from "@/components/courses/CourseForm.jsx";
import CourseCard from "@/components/courses/CourseCard.jsx";
import { callSummaryApi } from "@/lib/apiClient";
import SummaryApi from "@/lib/SummaryApi";
import { normalizeError, isAdmin, isResearcher } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider.jsx";

async function fetchCourses(filters) {
  return callSummaryApi(SummaryApi.courses.list, {
    params: {
      departmentId: filters.departmentId || undefined,
      topicId: filters.topicId || undefined
    }
  });
}

async function fetchDepartments() {
  return callSummaryApi(SummaryApi.departments.list);
}

async function fetchTopics() {
  return callSummaryApi(SummaryApi.topics.list);
}

async function fetchInstructorDashboard(enabled) {
  if (!enabled) return null;
  return callSummaryApi(SummaryApi.dashboard.instructor);
}

export default function CoursesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const admin = isAdmin(user);
  const researcher = isResearcher(user);

  const [filters, setFilters] = useState({
    departmentId: "",
    topicId: "",
    keyword: ""
  });

  const [showForm, setShowForm] = useState(false);

  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments
  });

  const topicsQuery = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics
  });

  const coursesQuery = useQuery({
    queryKey: ["courses", filters],
    queryFn: () => fetchCourses(filters)
  });

  const instructorQuery = useQuery({
    queryKey: ["dashboard", "instructor"],
    queryFn: () => fetchInstructorDashboard(researcher || admin),
    enabled: researcher || admin
  });

  const createMutation = useMutation({
    mutationFn: (payload) =>
      callSummaryApi(SummaryApi.courses.create, { payload }),
    onSuccess: () => {
      toast.success("Course created successfully.");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "instructor"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      callSummaryApi(SummaryApi.courses.updateStatus(id), { payload: { status } }),
    onSuccess: () => {
      toast.success("Course status updated.");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "instructor"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const enrollMutation = useMutation({
    mutationFn: (id) =>
      callSummaryApi(SummaryApi.courses.enroll(id), { payload: {} }),
    onSuccess: () => {
      toast.success("Enrolment confirmed.");
      queryClient.invalidateQueries({ queryKey: ["dashboard", "student"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const courses = useMemo(() => {
    const list = coursesQuery.data?.data ?? [];
    if (!filters.keyword) return list;
    const lower = filters.keyword.toLowerCase();
    return list.filter((course) =>
      [course.title, course.description]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(lower))
    );
  }, [coursesQuery.data?.data, filters.keyword]);

  const departments = departmentsQuery.data?.data ?? [];
  const topics = topicsQuery.data?.data ?? [];

  const filteredTopics = useMemo(() => {
    if (!filters.departmentId) return topics;
    return topics.filter((topic) => topic.department?._id === filters.departmentId || topic.department === filters.departmentId);
  }, [filters.departmentId, topics]);

  const instructorCourses = instructorQuery.data?.data?.courses ?? [];

  const handleStatusUpdate = (course, status) => {
    updateStatusMutation.mutate({ id: course._id, status });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Learning studio
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Courses & workshops
          </h1>
          <p className="text-sm text-slate-600">
            Build evidence-based programmes, share department-grade micro-courses, and empower students with specialised training.
          </p>
        </div>
        {(researcher || admin) && (
          <Button onClick={() => setShowForm(true)}>Create course</Button>
        )}
      </header>

      <Card className="grid gap-4 md:grid-cols-4">
        <Select
          label="Department"
          value={filters.departmentId}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, departmentId: event.target.value, topicId: "" }))
          }
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
          onChange={(event) => setFilters((prev) => ({ ...prev, topicId: event.target.value }))}
          disabled={!filters.departmentId && !filteredTopics.length}
        >
          <option value="">All topics</option>
          {filteredTopics.map((topic) => (
            <option key={topic._id} value={topic._id}>
              {topic.title}
            </option>
          ))}
        </Select>

        <Input
          label="Search"
          placeholder="Search by title or summary"
          value={filters.keyword}
          onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
        />

        <Card className="flex flex-col justify-center border border-indigo-100 bg-indigo-50 text-xs font-semibold text-indigo-700">
          Total published courses: {coursesQuery.data?.data?.length ?? 0}
        </Card>
      </Card>

      {coursesQuery.isLoading ? (
        <Card className="flex items-center gap-3 text-sm text-slate-500">
          <Loader />
          Loading courses…
        </Card>
      ) : !courses.length ? (
        <Card className="text-sm text-slate-500">
          No courses found. Adjust filters or author a new course outline.
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              canReview={admin}
              canEnroll={user?.role === "STUDENT"}
              onApprove={() => handleStatusUpdate(course, "PUBLISHED")}
              onReject={() => handleStatusUpdate(course, "REJECTED")}
              onEnroll={() => enrollMutation.mutate(course._id)}
            />
          ))}
        </div>
      )}

      {(researcher || admin) && (
        <section className="space-y-4">
          <header className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Your authored courses</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Draft · Pending · Published
            </span>
          </header>
          {instructorQuery.isLoading ? (
            <Card className="flex items-center gap-3 text-sm text-slate-500">
              <Loader size="sm" />
              Loading your catalogue…
            </Card>
          ) : !instructorCourses.length ? (
            <Card className="text-sm text-slate-500">
              You haven’t submitted any courses yet. Use the create button to share your expertise.
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {instructorCourses.map((course) => (
                <Card key={course._id} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {course.title}
                    </h3>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                      {course.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="text-xs text-slate-500">
                    Created {new Date(course.createdAt).toLocaleDateString()} · Enrolments {course.enrollmentCount ?? 0}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Create course</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-slate-500 hover:text-rose-500"
              >
                Close
              </button>
            </div>
            <CourseForm
              departments={departments}
              topics={topics}
              loading={createMutation.isPending}
              onSubmit={(payload) => createMutation.mutate(payload)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}