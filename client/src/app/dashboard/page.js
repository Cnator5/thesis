// app/(dashboard)/dashboard/page.js
"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpenCheck, Compass, FileText, LibraryBig, Users2 } from "lucide-react";
import Card from "@/components/ui/Card.jsx";
import StatCard from "@/components/ui/StatCard.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import Button from "@/components/ui/Button.jsx";
import { callSummaryApi } from "@/lib/apiClient";
import SummaryApi from "@/lib/SummaryApi";
import { formatDate, formatDateTime, isAdmin, isResearcher } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider.jsx";

async function fetchStudent() {
  return callSummaryApi(SummaryApi.dashboard.student);
}

async function fetchInstructor() {
  return callSummaryApi(SummaryApi.dashboard.instructor);
}

async function fetchAdmin() {
  return callSummaryApi(SummaryApi.dashboard.admin);
}

async function fetchPublishedCourses() {
  return callSummaryApi(SummaryApi.courses.list);
}

async function fetchLatestArticles() {
  return callSummaryApi(SummaryApi.articles.list, { params: { status: "PUBLISHED", limit: 6 } });
}

async function fetchMyProfile() {
  return callSummaryApi(SummaryApi.auth.me);
}

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role ?? "STUDENT";
  const admin = isAdmin(user);
  const researcher = isResearcher(user);

  const studentQuery = useQuery({
    queryKey: ["dashboard", "student"],
    queryFn: fetchStudent,
    enabled: role === "STUDENT"
  });

  const instructorQuery = useQuery({
    queryKey: ["dashboard", "instructor"],
    queryFn: fetchInstructor,
    enabled: researcher || admin
  });

  const adminQuery = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: fetchAdmin,
    enabled: admin
  });

  const coursesQuery = useQuery({
    queryKey: ["courses", "published"],
    queryFn: fetchPublishedCourses
  });

  const articlesQuery = useQuery({
    queryKey: ["articles", "latest"],
    queryFn: fetchLatestArticles
  });

  const profileQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchMyProfile
  });

  const studentData = studentQuery.data?.data ?? {};
  const instructorData = instructorQuery.data?.data ?? {};
  const adminData = adminQuery.data?.data ?? {};
  const courses = coursesQuery.data?.data ?? [];
  const articles = articlesQuery.data?.data ?? [];
  const profile = profileQuery.data?.data ?? user;

  const overviewStats = useMemo(() => {
    const stats = [
      {
        title: "Published courses",
        value: courses.length,
        subtitle: "Available for enrolment",
        icon: <BookOpenCheck className="h-6 w-6 text-indigo-500" />
      },
      {
        title: "Published articles",
        value: articles.length,
        subtitle: "Fresh research briefs",
        icon: <FileText className="h-6 w-6 text-emerald-500" />
      }
    ];

    if (role === "STUDENT") {
      stats.push({
        title: "Active enrolments",
        value: studentData.enrollments?.length ?? 0,
        subtitle: "Continue your learning journey",
        icon: <Compass className="h-6 w-6 text-sky-500" />
      });
      stats.push({
        title: "Borrowed items",
        value: studentData.borrows?.length ?? 0,
        subtitle: "Return on time to avoid fines",
        icon: <LibraryBig className="h-6 w-6 text-amber-500" />
      });
    }

    if (researcher || admin) {
      stats.push({
        title: "Courses authored",
        value: instructorData.courses?.length ?? 0,
        subtitle: "Awaiting moderation or published",
        icon: <BookOpenCheck className="h-6 w-6 text-purple-500" />
      });
      stats.push({
        title: "Articles submitted",
        value: instructorData.articles?.length ?? 0,
        subtitle: "Draft, pending or published",
        icon: <FileText className="h-6 w-6 text-rose-500" />
      });
    }

    if (admin) {
      stats.unshift({
        title: "Pending articles",
        value: adminData.pendingArticles ?? 0,
        subtitle: "Review manuscripts awaiting approval",
        icon: <Users2 className="h-6 w-6 text-rose-500" />
      });
      stats.unshift({
        title: "Pending courses",
        value: adminData.pendingCourses ?? 0,
        subtitle: "Publish reviewed programmes",
        icon: <Compass className="h-6 w-6 text-amber-500" />
      });
      stats.push({
        title: "Active borrows",
        value: adminData.activeBorrows ?? 0,
        subtitle: "Monitor returns & overdue items",
        icon: <LibraryBig className="h-6 w-6 text-emerald-500" />
      });
    }

    return stats;
  }, [admin, adminData, articles.length, courses.length, instructorData, researcher, role, studentData]);

  const loading =
    studentQuery.isLoading ||
    instructorQuery.isLoading ||
    adminQuery.isLoading ||
    coursesQuery.isLoading ||
    articlesQuery.isLoading;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Dashboard overview
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Welcome back, {profile?.name?.split(" ")[0] ?? "scholar"}!
          </h1>
          <p className="text-sm text-slate-600">
            {role === "STUDENT"
              ? "Track your academic progress, library loans, and new publications."
              : admin
              ? "Oversee contributions across departments and keep knowledge flowing."
              : "Publish manuscripts, create learning experiences, and guide departmental research."}
          </p>
        </div>
        <Card className="flex flex-col gap-1 rounded-3xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs font-semibold text-indigo-700">
          <span>Role: {profile?.role ?? "—"}</span>
          <span>Member since: {formatDate(profile?.createdAt)}</span>
          <span>
            Last login:{" "}
            {profile?.lastLoginAt ? formatDateTime(profile.lastLoginAt) : "—"}
          </span>
        </Card>
      </header>

      {loading ? (
        <Card className="flex items-center gap-3 text-sm text-slate-500">
          <Loader />
          Loading your personalised insight feed…
        </Card>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overviewStats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </section>

          {role === "STUDENT" && (
            <section className="grid gap-6 lg:grid-cols-2">
              <Card className="space-y-4">
                <header className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Active enrolments</h2>
                  <Button size="sm" variant="ghost" asChild>
                    <a href="/courses">Browse courses</a>
                  </Button>
                </header>
                {studentData.enrollments?.length ? (
                  <div className="space-y-3">
                    {studentData.enrollments.map((enrolment) => (
                      <div
                        key={enrolment._id}
                        className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {enrolment.course?.title ?? "Untitled course"}
                        </p>
                        <p className="text-xs text-slate-500">
                          Progress {enrolment.progress ?? 0}% · Status {enrolment.status}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    You are not enrolled in any courses yet. Discover micro-courses tailored to your research journey.
                  </p>
                )}
              </Card>

              <Card className="space-y-4">
                <header className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Borrowed titles</h2>
                  <Button size="sm" variant="ghost" asChild>
                    <a href="/library">Library catalogue</a>
                  </Button>
                </header>
                {studentData.borrows?.length ? (
                  <div className="space-y-3">
                    {studentData.borrows.map((borrow) => (
                      <div
                        key={borrow._id}
                        className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {borrow.book?.title ?? "Untitled resource"}
                        </p>
                        <p className="text-xs text-slate-500">
                          Due {formatDate(borrow.dueAt)} · Status {borrow.status}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No active borrows. Request new resources from the library team or explore the digital shelf.
                  </p>
                )}
              </Card>
            </section>
          )}

          {(researcher || admin) && (
            <section className="grid gap-6 lg:grid-cols-2">
              <Card className="space-y-4">
                <header className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Your courses</h2>
                  <Button size="sm" variant="ghost" asChild>
                    <a href="/courses">Manage courses</a>
                  </Button>
                </header>
                {instructorData.courses?.length ? (
                  <div className="space-y-3">
                    {instructorData.courses.map((course) => (
                      <div
                        key={course._id}
                        className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {course.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          Status {course.status} · Enrolments {course.enrollmentCount ?? 0}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    You haven’t authored any courses yet. Share your expertise with the Research Guru community.
                  </p>
                )}
              </Card>

              <Card className="space-y-4">
                <header className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Your articles</h2>
                  <Button size="sm" variant="ghost" asChild>
                    <a href="/articles">Submit article</a>
                  </Button>
                </header>
                {instructorData.articles?.length ? (
                  <div className="space-y-3">
                    {instructorData.articles.map((article) => (
                      <div
                        key={article._id}
                        className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {article.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          Status {article.status} · Views {article.viewCount ?? 0}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Draft your first manuscript and submit it for review. Let us help you finalise the prefect project brief.
                  </p>
                )}
              </Card>
            </section>
          )}

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4">
              <header>
                <h2 className="text-lg font-semibold text-slate-900">Featured courses</h2>
                <p className="text-sm text-slate-500">
                  Enrol in curated programmes designed by our research faculty.
                </p>
              </header>
              {courses.length ? (
                <div className="space-y-3">
                  {courses.slice(0, 5).map((course) => (
                    <div
                      key={course._id}
                      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                    >
                      <p className="text-sm font-semibold text-slate-900">{course.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>Level: {course.level}</span>
                        <span>Duration: {course.durationWeeks ?? "—"} weeks</span>
                        <span>Price: {course.price ? `${course.price.toLocaleString()} XAF` : "Free"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  The teaching team is preparing fresh course experiences for you. Check back soon!
                </p>
              )}
            </Card>

            <Card className="space-y-4">
              <header>
                <h2 className="text-lg font-semibold text-slate-900">Latest articles</h2>
                <p className="text-sm text-slate-500">
                  Browse recently published manuscripts from across departments.
                </p>
              </header>
              {articles.length ? (
                <div className="space-y-3">
                  {articles.slice(0, 5).map((article) => (
                    <div
                      key={article._id}
                      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                    >
                      <p className="text-sm font-semibold text-slate-900">{article.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {article.abstract}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>Preview pages: {article.previewPageLimit}</span>
                        <span>Downloads: {article.downloadCount ?? 0}</span>
                        <span>Views: {article.viewCount ?? 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No public manuscripts yet. Encourage your peers to submit their research for review.
                </p>
              )}
            </Card>
          </section>
        </>
      )}
    </div>
  );
}