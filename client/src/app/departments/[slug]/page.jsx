// // app/departments/[slug]/page.js
// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import Card from "../../../components/ui/Card.jsx";
// import { Loader } from "../../../components/ui/Loader.jsx";
// import { callSummaryApi } from "../../../lib/apiClient.js";
// import SummaryApi from "../../../lib/SummaryApi.js";

// async function fetchDepartments() {
//   return callSummaryApi(SummaryApi.departments.list);
// }
// async function fetchTopics(params) {
//   return callSummaryApi(SummaryApi.topics.list, { params });
// }

// export default function DepartmentDetailPage() {
//   const { slug } = useParams();

//   const depQuery = useQuery({ queryKey: ["deps"], queryFn: fetchDepartments });
//   const department =
//     depQuery.data?.data?.find((d) => d.slug === slug || d._id === slug) ?? null;

//   const topicsQuery = useQuery({
//     queryKey: ["topics", department?._id],
//     queryFn: () => fetchTopics({ departmentId: department?._id }),
//     enabled: Boolean(department)
//   });

//   return (
//     <div className="mx-auto w-full max-w-7xl px-4 py-10">
//       {!department ? (
//         depQuery.isLoading ? (
//           <div className="flex items-center gap-2 text-sm text-slate-500">
//             <Loader /> Loading department…
//           </div>
//         ) : (
//           <p className="text-sm text-rose-600">Department not found.</p>
//         )
//       ) : (
//         <>
//           <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
//             {department.name} Project Topics
//           </h1>
//           <p className="mb-6 text-center text-sm text-slate-500">
//             Explore curated project topics with their codes.
//           </p>

//           <Card className="overflow-x-auto">
//             {topicsQuery.isLoading ? (
//               <div className="flex items-center gap-2 text-sm text-slate-500">
//                 <Loader /> Loading topics…
//               </div>
//             ) : !topicsQuery.data?.data?.length ? (
//               <p className="text-sm text-slate-500">No topics yet.</p>
//             ) : (
//               <table className="min-w-full text-left text-sm">
//                 <thead className="bg-slate-100 text-slate-700">
//                   <tr>
//                     <th className="px-4 py-3">CODE</th>
//                     <th className="px-4 py-3">PROJECT TITLE</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {topicsQuery.data.data.map((t) => (
//                     <tr key={t._id} className="border-b last:border-0">
//                       <td className="px-4 py-3 font-semibold">{t.code}</td>
//                       <td className="px-4 py-3">
//                         <Link href={`/topics/${t.slug ?? t._id}`} className="text-teal-700 hover:underline">
//                           {t.title}
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </Card>
//         </>
//       )}
//     </div>
//   );
// }



"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Card from "../../../components/ui/Card.jsx";
import { Loader } from "../../../components/ui/Loader.jsx";
import { callSummaryApi } from "../../../lib/apiClient.js";
import SummaryApi from "../../../lib/SummaryApi.js";

async function fetchDepartments() {
  return callSummaryApi(SummaryApi.departments.list);
}

async function fetchTopicsByDepartment(departmentId) {
  return callSummaryApi(SummaryApi.topics.list, {
    params: { departmentId }
  });
}

export default function DepartmentDetailPage() {
  const { slug } = useParams();

  const departmentsQuery = useQuery({
    queryKey: ["departments", "detail"],
    queryFn: fetchDepartments
  });

  const departments = departmentsQuery.data?.data ?? [];

  const department = useMemo(
    () => departments.find((dept) => dept.slug === slug || dept._id === slug) ?? null,
    [departments, slug]
  );

  const topicsQuery = useQuery({
    queryKey: ["department-topics", department?._id],
    queryFn: () => fetchTopicsByDepartment(department._id),
    enabled: Boolean(department?._id)
  });

  const topics = topicsQuery.data?.data ?? [];

  if (departmentsQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader /> Loading department…
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <p className="text-sm text-rose-600">Department not found.</p>
        <Link href="/departments" className="mt-4 inline-block text-teal-700 hover:underline">
          ← Back to departments
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{department.name}</h1>
          {department.description && (
            <p className="mt-2 max-w-3xl text-sm text-slate-600">{department.description}</p>
          )}
        </div>
        <Link href="/departments" className="text-sm font-semibold text-teal-700 hover:underline">
          ← Back to departments
        </Link>
      </div>

      <Card className="overflow-x-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Topics in {department.name}
          </h2>
        </div>

        {topicsQuery.isLoading ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
            <Loader /> Loading topics…
          </div>
        ) : !topics.length ? (
          <p className="mt-6 text-sm text-slate-500">
            No topics have been published for this department yet.
          </p>
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
                {topics.map((topic) => (
                  <tr key={topic._id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-semibold">{topic.code}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/topics/${topic.slug ?? topic._id}`}
                        className="text-teal-700 hover:underline"
                      >
                        {topic.title}
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
  );
}