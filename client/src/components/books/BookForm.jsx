// components/books/BookForm.jsx
"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input.jsx";
import Textarea from "@/components/ui/Textarea.jsx";
import Select from "@/components/ui/Select.jsx";
import Button from "@/components/ui/Button.jsx";
import { Loader } from "@/components/ui/Loader.jsx";

const baseSchema = z.object({
  title: z.string().min(2, "Title is required."),
  isbn: z.string().optional(),
  authors: z.string().optional(),
  departmentId: z.string().optional(),
  topicId: z.string().optional(),
  categories: z.string().optional(),
  summary: z.string().optional(),
  tags: z.string().optional(),
  copiesOwned: z.coerce.number().int().min(1),
  copiesAvailable: z.coerce.number().int().min(0),
  location: z.string().optional(),
  publishYear: z.string().optional(),
  coverImage: z.any().optional(),
  bookDocument: z.any().optional()
});

export default function BookForm({
  mode = "create",
  defaultValues,
  departments,
  topics,
  loading,
  onSubmit,
  onCancel
}) {
  const schema = useMemo(() => baseSchema, []);

  const initialValues = useMemo(() => {
    if (!defaultValues) {
      return {
        title: "",
        isbn: "",
        authors: "",
        departmentId: "",
        topicId: "",
        categories: "",
        summary: "",
        tags: "",
        copiesOwned: 1,
        copiesAvailable: 1,
        location: "",
        publishYear: "",
        coverImage: undefined,
        bookDocument: undefined
      };
    }

    return {
      title: defaultValues.title ?? "",
      isbn: defaultValues.isbn ?? "",
      authors: Array.isArray(defaultValues.authors)
        ? defaultValues.authors.join(", ")
        : defaultValues.authors ?? "",
      departmentId: defaultValues.department?._id ?? defaultValues.department ?? "",
      topicId: defaultValues.topic?._id ?? defaultValues.topic ?? "",
      categories: Array.isArray(defaultValues.categories)
        ? defaultValues.categories.join(", ")
        : defaultValues.categories ?? "",
      summary: defaultValues.summary ?? "",
      tags: Array.isArray(defaultValues.tags)
        ? defaultValues.tags.join(", ")
        : defaultValues.tags ?? "",
      copiesOwned: defaultValues.copiesOwned ?? 1,
      copiesAvailable: defaultValues.copiesAvailable ?? defaultValues.copiesOwned ?? 1,
      location: defaultValues.location ?? "",
      publishYear: defaultValues.publishYear?.toString() ?? "",
      coverImage: undefined,
      bookDocument: undefined
    };
  }, [defaultValues]);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const departmentId = watch("departmentId");
  const filteredTopics = useMemo(() => {
    if (!departmentId) return topics;
    return topics.filter(
      (topic) => topic.department?._id === departmentId || topic.department === departmentId
    );
  }, [departmentId, topics]);

  const submitHandler = (values) => {
    if (mode === "create") {
      const formData = new FormData();
      formData.append("title", values.title);
      if (values.isbn) formData.append("isbn", values.isbn);
      if (values.authors) {
        formData.append(
          "authors",
          JSON.stringify(
            values.authors
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          )
        );
      }
      if (values.departmentId) formData.append("departmentId", values.departmentId);
      if (values.topicId) formData.append("topicId", values.topicId);
      if (values.categories) {
        formData.append(
          "categories",
          JSON.stringify(
            values.categories
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          )
        );
      }
      if (values.summary) formData.append("summary", values.summary);
      if (values.tags) {
        formData.append(
          "tags",
          JSON.stringify(
            values.tags
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          )
        );
      }
      formData.append("copiesOwned", String(values.copiesOwned));
      formData.append("copiesAvailable", String(values.copiesAvailable));
      if (values.location) formData.append("location", values.location);
      if (values.publishYear) formData.append("publishYear", values.publishYear);

      const cover = values.coverImage?.[0];
      if (cover) {
        formData.append("coverImage", cover);
      }

      const bookDocument = values.bookDocument?.[0];
      if (bookDocument) {
        formData.append("bookDocument", bookDocument);
      }

      onSubmit(formData);
      return;
    }

    const payload = {
      title: values.title,
      isbn: values.isbn || undefined,
      authors: values.authors
        ? values.authors.split(",").map((item) => item.trim()).filter(Boolean)
        : undefined,
      department: values.departmentId || undefined,
      topic: values.topicId || undefined,
      categories: values.categories
        ? values.categories.split(",").map((item) => item.trim()).filter(Boolean)
        : undefined,
      summary: values.summary || undefined,
      tags: values.tags
        ? values.tags.split(",").map((item) => item.trim()).filter(Boolean)
        : undefined,
      copiesOwned: values.copiesOwned,
      copiesAvailable: values.copiesAvailable,
      location: values.location || undefined,
      publishYear: values.publishYear ? Number(values.publishYear) : undefined
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Title"
          required
          error={errors.title?.message}
          {...register("title")}
        />
        <Input
          label="ISBN"
          placeholder="978-1234567890"
          error={errors.isbn?.message}
          {...register("isbn")}
        />
        <Input
          label="Authors"
          placeholder="Separate authors with commas"
          error={errors.authors?.message}
          {...register("authors")}
        />
        <Select
          label="Department"
          value={departmentId}
          onChange={(event) => {
            setValue("departmentId", event.target.value);
            setValue("topicId", "");
          }}
        >
          <option value="">Select department</option>
          {departments.map((department) => (
            <option key={department._id} value={department._id}>
              {department.name}
            </option>
          ))}
        </Select>
        <Select
          label="Topic"
          error={errors.topicId?.message}
          {...register("topicId")}
        >
          <option value="">Select topic</option>
          {filteredTopics.map((topic) => (
            <option key={topic._id} value={topic._id}>
              {topic.title}
            </option>
          ))}
        </Select>
        <Input
          label="Categories"
          placeholder="policy, development"
          error={errors.categories?.message}
          {...register("categories")}
        />
      </div>

      <Textarea
        label="Summary"
        rows={4}
        placeholder="Provide a short synopsis of the resource."
        error={errors.summary?.message}
        {...register("summary")}
      />

      <Input
        label="Tags"
        placeholder="Keywords separated by commas"
        error={errors.tags?.message}
        {...register("tags")}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Input
          label="Copies owned"
          type="number"
          min={1}
          error={errors.copiesOwned?.message}
          {...register("copiesOwned", { valueAsNumber: true })}
        />
        <Input
          label="Copies available"
          type="number"
          min={0}
          error={errors.copiesAvailable?.message}
          {...register("copiesAvailable", { valueAsNumber: true })}
        />
        <Input
          label="Publish year"
          type="number"
          min={1800}
          placeholder="2025"
          error={errors.publishYear?.message}
          {...register("publishYear")}
        />
      </div>

      <Input
        label="Location"
        placeholder="Main shelf / Digital"
        error={errors.location?.message}
        {...register("location")}
      />

      {mode === "create" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Cover image"
            type="file"
            accept="image/*"
            error={errors.coverImage?.message}
            {...register("coverImage")}
          />
          <Input
            label="Digital file (PDF)"
            type="file"
            accept="application/pdf"
            error={errors.bookDocument?.message}
            {...register("bookDocument")}
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader size="sm" />
              Saving…
            </>
          ) : mode === "create" ? (
            "Add book"
          ) : (
            "Update book"
          )}
        </Button>
      </div>
    </form>
  );
}