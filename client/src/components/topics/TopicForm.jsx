// components/topics/TopicForm.jsx
"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input.jsx";
import Textarea from "@/components/ui/Textarea.jsx";
import Select from "@/components/ui/Select.jsx";
import Button from "@/components/ui/Button.jsx";

const schema = z.object({
  title: z.string().min(3, "Title is required."),
  code: z.string().min(2, "Code is required."),
  departmentId: z.string().min(1, "Select a department."),
  summary: z.string().optional(),
  keywords: z.string().optional()
});

export default function TopicForm({ departments, defaultValues, loading, onSubmit, onCancel }) {
  const initialValues = useMemo(
    () =>
      defaultValues
        ? {
            title: defaultValues.title ?? "",
            code: defaultValues.code ?? "",
            departmentId: defaultValues.department?._id ?? "",
            summary: defaultValues.summary ?? "",
            keywords: (defaultValues.keywords ?? []).join(", ")
          }
        : {
            title: "",
            code: "",
            departmentId: "",
            summary: "",
            keywords: ""
          },
    [defaultValues]
  );

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues
  });

  const submitHandler = (values) => {
    onSubmit({
      ...values,
      keywords: values.keywords
        ? values.keywords.split(",").map((item) => item.trim()).filter(Boolean)
        : []
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <Input label="Title" error={errors.title?.message} {...register("title")} />
      <Input label="Code" error={errors.code?.message} {...register("code")} />
      <Select
        label="Department"
        error={errors.departmentId?.message}
        {...register("departmentId")}
      >
        <option value="">Select department</option>
        {departments.map((department) => (
          <option key={department._id} value={department._id}>
            {department.name}
          </option>
        ))}
      </Select>
      <Textarea
        label="Summary"
        rows={3}
        error={errors.summary?.message}
        {...register("summary")}
      />
      <Input
        label="Keywords"
        placeholder="Separate with commas"
        error={errors.keywords?.message}
        {...register("keywords")}
      />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save topic"}
        </Button>
      </div>
    </form>
  );
}