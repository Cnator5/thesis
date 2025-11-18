// app/(dashboard)/departments/page.js
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Card from "@/components/ui/Card.jsx";
import Input from "@/components/ui/Input.jsx";
import Textarea from "@/components/ui/Textarea.jsx";
import Button from "@/components/ui/Button.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import { callSummaryApi } from "@/lib/apiClient";
import SummaryApi from "@/lib/SummaryApi";
import { formatDate, normalizeError } from "@/lib/utils";
import useRequireRole from "@/hooks/useRequireRole.js";

async function fetchDepartments() {
  return callSummaryApi(SummaryApi.departments.list);
}

export default function DepartmentsPage() {
  useRequireRole("ADMIN");
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    name: "",
    description: ""
  });

  const [editing, setEditing] = useState(null);

  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments
  });

  const createMutation = useMutation({
    mutationFn: (payload) =>
      callSummaryApi(SummaryApi.departments.create, { payload }),
    onSuccess: () => {
      toast.success("Department created.");
      setFormState({ name: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      callSummaryApi(SummaryApi.departments.update(id), { payload }),
    onSuccess: () => {
      toast.success("Department updated.");
      setEditing(null);
      setFormState({ name: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => callSummaryApi(SummaryApi.departments.remove(id)),
    onSuccess: () => {
      toast.success("Department removed.");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const departments = useMemo(() => departmentsQuery.data?.data ?? [], [departmentsQuery.data?.data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editing) {
      updateMutation.mutate({
        id: editing._id,
        payload: { name: formState.name, description: formState.description }
      });
    } else {
      createMutation.mutate(formState);
    }
  };

  const startEdit = (department) => {
    setEditing(department);
    setFormState({ name: department.name, description: department.description ?? "" });
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormState({ name: "", description: "" });
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Organisational structure
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Departments
        </h1>
        <p className="text-sm text-slate-600">
          Define faculties and schools, manage their metadata, and connect topics for research briefs.
        </p>
      </header>

      <Card as="form" onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <Input
          label="Department name"
          value={formState.name}
          onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <Textarea
          label="Description"
          className="md:col-span-2"
          value={formState.description}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, description: event.target.value }))
          }
          placeholder="Summarise the department's focus, specialities, and key programmes."
          rows={3}
        />
        <div className="flex items-center gap-3 md:col-span-2">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {(createMutation.isPending || updateMutation.isPending) ? (
              <>
                <Loader size="sm" />
                Saving…
              </>
            ) : editing ? (
              "Update department"
            ) : (
              "Create department"
            )}
          </Button>
          {editing && (
            <Button type="button" variant="ghost" onClick={cancelEdit}>
              Cancel edit
            </Button>
          )}
        </div>
      </Card>

      {departmentsQuery.isLoading ? (
        <Card className="flex items-center gap-3 text-sm text-slate-500">
          <Loader />
          Loading departments…
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {departments.map((department) => (
            <Card key={department._id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{department.name}</h3>
                  <p className="text-xs text-slate-500">Slug: {department.slug}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Created {formatDate(department.createdAt)}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 whitespace-pre-line">
                {department.description || "No description provided."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => startEdit(department)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (!window.confirm(`Delete department "${department.name}"? This cannot be undone.`)) return;
                    deleteMutation.mutate(department._id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}