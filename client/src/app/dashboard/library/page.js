// app/(dashboard)/library/page.js
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Card from "@/components/ui/Card.jsx";
import Select from "@/components/ui/Select.jsx";
import Input from "@/components/ui/Input.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import BookCard from "@/components/books/BookCard.jsx";
import BookForm from "@/components/books/BookForm.jsx";
import { callSummaryApi } from "@/lib/apiClient";
import SummaryApi from "@/lib/SummaryApi";
import { normalizeError, isAdmin } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider.jsx";

async function fetchBooks(filters) {
  return callSummaryApi(SummaryApi.books.list, {
    params: {
      departmentId: filters.departmentId || undefined,
      topicId: filters.topicId || undefined,
      keyword: filters.keyword || undefined
    }
  });
}

async function fetchDepartments() {
  return callSummaryApi(SummaryApi.departments.list);
}

async function fetchTopics() {
  return callSummaryApi(SummaryApi.topics.list);
}

export default function LibraryPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const admin = isAdmin(user);

  const [filters, setFilters] = useState({
    departmentId: "",
    topicId: "",
    keyword: ""
  });

  const [modalState, setModalState] = useState({
    open: false,
    mode: "create",
    book: null
  });

  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments
  });

  const topicsQuery = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics
  });

  const booksQuery = useQuery({
    queryKey: ["books", filters],
    queryFn: () => fetchBooks(filters)
  });

  const createMutation = useMutation({
    mutationFn: (formData) =>
      callSummaryApi(SummaryApi.books.create, { payload: formData }),
    onSuccess: () => {
      toast.success("Book added to the library.");
      setModalState({ open: false, mode: "create", book: null });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      callSummaryApi(SummaryApi.books.update(id), { payload }),
    onSuccess: () => {
      toast.success("Book details updated.");
      setModalState({ open: false, mode: "create", book: null });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const deleteMutation = useMutation({
    mutationFn: (bookId) =>
      callSummaryApi(SummaryApi.books.remove(bookId)),
    onSuccess: () => {
      toast.success("Book removed.");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => toast.error(normalizeError(error))
  });

  const books = useMemo(() => {
    const list = booksQuery.data?.data ?? [];
    if (!filters.keyword) return list;
    const term = filters.keyword.toLowerCase();
    return list.filter((book) =>
      [book.title, book.summary, (book.authors ?? []).join(" ")]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [booksQuery.data?.data, filters.keyword]);

  const departments = departmentsQuery.data?.data ?? [];
  const topics = topicsQuery.data?.data ?? [];

  const filteredTopics = useMemo(() => {
    if (!filters.departmentId) return topics;
    return topics.filter((topic) => topic.department?._id === filters.departmentId || topic.department === filters.departmentId);
  }, [filters.departmentId, topics]);

  const openCreateModal = () => {
    setModalState({ open: true, mode: "create", book: null });
  };

  const openEditModal = (book) => {
    setModalState({ open: true, mode: "edit", book });
  };

  const closeModal = () => {
    setModalState({ open: false, mode: "create", book: null });
  };

  const handleDelete = (book) => {
    if (!window.confirm(`Delete "${book.title}" from the library?`)) return;
    deleteMutation.mutate(book._id);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Library catalogue
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Books & digital resources
          </h1>
          <p className="text-sm text-slate-600">
            Curate physical and digital assets, track circulation, and connect resources to departments and topics.
          </p>
        </div>
        {admin && (
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <Plus size={18} />
            Add book
          </Button>
        )}
      </header>

      <Card className="grid gap-4 md:grid-cols-4">
        <Select
          label="Department"
          value={filters.departmentId}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              departmentId: event.target.value,
              topicId: ""
            }))
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
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, topicId: event.target.value }))
          }
        >
          <option value="">All topics</option>
          {filteredTopics.map((topic) => (
            <option key={topic._id} value={topic._id}>
              {topic.title}
            </option>
          ))}
        </Select>

        <Input
          label="Keyword"
          placeholder="Search by title or summary"
          value={filters.keyword}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, keyword: event.target.value }))
          }
        />

        <Card className="flex flex-col justify-center border border-indigo-100 bg-indigo-50 text-xs font-semibold text-indigo-700">
          Total resources: {booksQuery.data?.data?.length ?? 0}
        </Card>
      </Card>

      {booksQuery.isLoading ? (
        <Card className="flex items-center gap-3 text-sm text-slate-500">
          <Loader />
          Loading library catalogue…
        </Card>
      ) : !books.length ? (
        <Card className="text-sm text-slate-500">
          No books match your filters. Adjust search or add new resources.
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              isAdmin={admin}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modalState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                {modalState.mode === "create" ? "Add new book" : "Edit book"}
              </h2>
              <button
                onClick={closeModal}
                className="text-sm text-slate-500 hover:text-rose-500"
              >
                Close
              </button>
            </div>
            <BookForm
              mode={modalState.mode}
              departments={departments}
              topics={topics}
              defaultValues={modalState.book}
              loading={createMutation.isPending || updateMutation.isPending}
              onSubmit={(payload) => {
                if (modalState.mode === "create") {
                  createMutation.mutate(payload);
                } else {
                  updateMutation.mutate({ id: modalState.book._id, payload });
                }
              }}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}