// app/(dashboard)/admin/users/page.js
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import { callSummaryApi } from "@/lib/apiClient";
import SummaryApi from "@/lib/SummaryApi";
import { formatDate, normalizeError } from "@/lib/utils";
import useRequireRole from "@/hooks/useRequireRole.js";

async function fetchUsers() {
  return callSummaryApi(SummaryApi.users.list);
}

async function registerAdmin(payload) {
  return callSummaryApi(SummaryApi.users.createAdmin, { payload });
}

const initialForm = {
  name: "",
  username: "",
  email: "",
  phone: "",
  password: ""
};

export default function AdminUsersPage() {
  useRequireRole("ADMIN");
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [formState, setFormState] = useState(initialForm);

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers
  });

  const createMutation = useMutation({
    mutationFn: registerAdmin,
    onSuccess: () => {
      toast.success("Administrator created.");
      setFormOpen(false);
      setFormState(initialForm);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const users = useMemo(() => usersQuery.data?.data ?? [], [usersQuery.data?.data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    createMutation.mutate(formState);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Access control
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Users & administrators
          </h1>
          <p className="text-sm text-slate-600">
            Create admin accounts, monitor user activity, and ensure correct privileges across teams.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>Create admin</Button>
      </header>

      {usersQuery.isLoading ? (
        <Card className="flex items-center gap-3 text-sm text-slate-500">
          <Loader />
          Loading users…
        </Card>
      ) : (
        <div className="grid gap-3">
          {users.map((user) => (
            <Card key={user.id ?? user._id} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">
                  {user.email} • @{user.username}
                </p>
                <p className="text-xs text-slate-400">
                  Role {user.role} · Joined {formatDate(user.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-600">
                  Status: {user.status}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
                  Verified: {user.isVerified ? "Yes" : "No"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Create administrator</h2>
              <button
                onClick={() => setFormOpen(false)}
                className="text-sm text-slate-500 hover:text-rose-500"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full name"
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
                <Input
                  label="Username"
                  value={formState.username}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, username: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  value={formState.email}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />
                <Input
                  label="Phone"
                  value={formState.phone}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  placeholder="+237600000000"
                />
              </div>

              <Input
                label="Temporary password"
                type="password"
                value={formState.password}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, password: event.target.value }))
                }
                required
              />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <Loader size="sm" />
                      Creating…
                    </>
                  ) : (
                    "Create admin"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}