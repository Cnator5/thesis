// app/(dashboard)/admin/borrows/page.js
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button.jsx";
import Card from "@/components/ui/Card.jsx";
import Select from "@/components/ui/Select.jsx";
import Input from "@/components/ui/Input.jsx";
import Textarea from "@/components/ui/Textarea.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import BorrowList from "@/components/books/BorrowList.jsx";
import { callSummaryApi } from "@/lib/apiClient";
import SummaryApi from "@/lib/SummaryApi";
import { normalizeError } from "@/lib/utils";
import useRequireRole from "@/hooks/useRequireRole.js";

async function fetchBorrows() {
  return callSummaryApi(SummaryApi.borrows.adminList);
}

async function fetchBooks() {
  return callSummaryApi(SummaryApi.books.list);
}

async function fetchUsers() {
  return callSummaryApi(SummaryApi.users.list);
}

export default function AdminBorrowManagementPage() {
  useRequireRole("ADMIN");
  const queryClient = useQueryClient();

  const borrowsQuery = useQuery({
    queryKey: ["borrows", "admin"],
    queryFn: fetchBorrows
  });

  const booksQuery = useQuery({
    queryKey: ["books", "available"],
    queryFn: fetchBooks
  });

  const usersQuery = useQuery({
    queryKey: ["users", "all"],
    queryFn: fetchUsers
  });

  const recordMutation = useMutation({
    mutationFn: (payload) =>
      callSummaryApi(SummaryApi.borrows.create, { payload }),
    onSuccess: () => {
      toast.success("Borrow recorded.");
      queryClient.invalidateQueries({ queryKey: ["borrows", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const returnMutation = useMutation({
    mutationFn: (borrowId) =>
      callSummaryApi(SummaryApi.borrows.return, {
        payload: { borrowId, returnedAt: new Date().toISOString() }
      }),
    onSuccess: () => {
      toast.success("Return recorded.");
      queryClient.invalidateQueries({ queryKey: ["borrows", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const [formState, setFormState] = useState({
    userId: "",
    bookId: "",
    dueAt: "",
    notes: ""
  });

  const books = booksQuery.data?.data ?? [];
  const users = usersQuery.data?.data ?? [];
  const records = borrowsQuery.data?.data ?? [];

  const availableBooks = useMemo(
    () => books.filter((book) => Number(book.copiesAvailable ?? 0) > 0),
    [books]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.userId || !formState.bookId || !formState.dueAt) {
      toast.error("Select user, book, and due date.");
      return;
    }
    recordMutation.mutate(formState);
    setFormState({ userId: "", bookId: "", dueAt: "", notes: "" });
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Circulation control
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Borrow management
        </h1>
        <p className="text-sm text-slate-600">
          Issue resources, monitor returns, and keep borrowers accountable with automated reminders.
        </p>
      </header>

      <Card as="form" onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
        <Select
          label="Borrower"
          value={formState.userId}
          onChange={(event) => setFormState((prev) => ({ ...prev, userId: event.target.value }))}
        >
          <option value="">Select user</option>
          {users.map((user) => (
            <option key={user.id ?? user._id} value={user.id ?? user._id}>
              {user.name} — {user.email}
            </option>
          ))}
        </Select>

        <Select
          label="Book"
          value={formState.bookId}
          onChange={(event) => setFormState((prev) => ({ ...prev, bookId: event.target.value }))}
        >
          <option value="">Select book</option>
          {availableBooks.map((book) => (
            <option key={book._id} value={book._id}>
              {book.title} ({book.copiesAvailable} available)
            </option>
          ))}
        </Select>

        <Input
          label="Due date"
          type="date"
          value={formState.dueAt}
          onChange={(event) => setFormState((prev) => ({ ...prev, dueAt: event.target.value }))}
        />

        <Button type="submit" disabled={recordMutation.isPending} className="mt-auto">
          {recordMutation.isPending ? (
            <>
              <Loader size="sm" />
              Recording…
            </>
          ) : (
            "Issue borrow"
          )}
        </Button>

        <Textarea
          className="md:col-span-4"
          label="Notes"
          placeholder="Optional notes about this circulation (condition, agreements, etc.)"
          value={formState.notes}
          onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
        />
      </Card>

      {borrowsQuery.isLoading ? (
        <Card className="flex items-center gap-3 text-sm text-slate-500">
          <Loader />
          Loading borrow records…
        </Card>
      ) : (
        <BorrowList
          records={records}
          onReturn={(record) => returnMutation.mutate(record._id)}
          isAdmin
        />
      )}
    </div>
  );
}