// components/articles/ArticleForm.jsx
"use client";

import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input.jsx";
import Textarea from "@/components/ui/Textarea.jsx";
import Select from "@/components/ui/Select.jsx";
import Button from "@/components/ui/Button.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import Card from "../ui/Card";

const sectionSchema = z.object({
  heading: z.string().optional(),
  content: z.string().min(1, "Section content is required."),
  pageNumber: z.coerce.number().int().min(1, "Page number must be at least 1.")
});

const schema = z.object({
  title: z.string().min(3, "Title is required."),
  projectCode: z.string().min(2, "Project code is required."),
  abstract: z.string().min(20, "Abstract should be at least 20 characters."),
  departmentId: z.string().min(1, "Select a department."),
  topicId: z.string().min(1, "Select a topic."),
  previewPageLimit: z.coerce.number().int().min(1),
  totalPages: z.coerce.number().int().min(1),
  tags: z.string().optional(),
  allowDownload: z.boolean().optional(),
  priceLocal: z
    .preprocess((value) => (value === "" || value === undefined ? undefined : Number(value)), z.number().nonnegative().optional()),
  priceInternational: z
    .preprocess(
      (value) => (value === "" || value === undefined ? undefined : Number(value)),
      z.number().nonnegative().optional()
    ),
  bodySections: z.array(sectionSchema).min(1),
  coverImage: z.any().optional(),
  pdfDocument: z.any().optional()
});

export default function ArticleForm({
  departments,
  topics,
  loading,
  onSubmit,
  onCancel
}) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      projectCode: "",
      abstract: "",
      departmentId: "",
      topicId: "",
      previewPageLimit: 2,
      totalPages: 10,
      tags: "",
      allowDownload: false,
      priceLocal: "",
      priceInternational: "",
      bodySections: [
        {
          heading: "",
          content: "",
          pageNumber: 1
        }
      ],
      coverImage: undefined,
      pdfDocument: undefined
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bodySections"
  });

  const selectedDepartmentId = watch("departmentId");

  const filteredTopics = useMemo(() => {
    if (!selectedDepartmentId) return topics;
    return topics.filter((topic) => topic.department?._id === selectedDepartmentId || topic.department === selectedDepartmentId);
  }, [selectedDepartmentId, topics]);

  useEffect(() => {
    if (!filteredTopics.length) {
      setValue("topicId", "");
    } else {
      const current = watch("topicId");
      if (!filteredTopics.some((topic) => topic._id === current)) {
        setValue("topicId", filteredTopics[0]._id);
      }
    }
  }, [filteredTopics, setValue, watch]);

  const submitHandler = (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("projectCode", values.projectCode);
    formData.append("abstract", values.abstract);
    formData.append("departmentId", values.departmentId);
    formData.append("topicId", values.topicId);
    formData.append("previewPageLimit", String(values.previewPageLimit));
    formData.append("totalPages", String(values.totalPages));
    formData.append("allowDownload", values.allowDownload ? "true" : "false");

    if (values.priceLocal !== undefined && values.priceLocal !== null && values.priceLocal !== "") {
      formData.append("priceLocal", String(values.priceLocal));
    }
    if (values.priceInternational !== undefined && values.priceInternational !== null && values.priceInternational !== "") {
      formData.append("priceInternational", String(values.priceInternational));
    }
    if (values.tags) {
      formData.append(
        "tags",
        JSON.stringify(
          values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        )
      );
    }

    formData.append(
      "bodySections",
      JSON.stringify(
        values.bodySections.map((section) => ({
          heading: section.heading,
          content: section.content,
          pageNumber: Number(section.pageNumber)
        }))
      )
    );

    const coverFile = values.coverImage?.[0];
    if (coverFile) {
      formData.append("coverImage", coverFile);
    }

    const pdfFile = values.pdfDocument?.[0];
    if (pdfFile) {
      formData.append("pdfDocument", pdfFile);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Title"
          placeholder="Executive summary of Cameroon’s creative industries"
          error={errors.title?.message}
          {...register("title")}
        />
        <Input
          label="Project code"
          placeholder="RG-ENT-2025-01"
          error={errors.projectCode?.message}
          {...register("projectCode")}
        />
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
      </div>

      <Textarea
        label="Abstract"
        rows={4}
        placeholder="Concise summary of your manuscript, key findings, and methodology."
        error={errors.abstract?.message}
        {...register("abstract")}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Input
          label="Preview page limit"
          type="number"
          min={1}
          error={errors.previewPageLimit?.message}
          {...register("previewPageLimit", { valueAsNumber: true })}
        />
        <Input
          label="Total pages"
          type="number"
          min={1}
          error={errors.totalPages?.message}
          {...register("totalPages", { valueAsNumber: true })}
        />
        <Select
          label="Allow download for students?"
          value={watch("allowDownload") ? "true" : "false"}
          onChange={(event) =>
            setValue("allowDownload", event.target.value === "true")
          }
        >
          <option value="false">No (preview only)</option>
          <option value="true">Yes (full PDF)</option>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Local price (XAF)"
          type="number"
          min={0}
          step={100}
          error={errors.priceLocal?.message}
          {...register("priceLocal")}
        />
        <Input
          label="International price (USD)"
          type="number"
          min={0}
          step={1}
          error={errors.priceInternational?.message}
          {...register("priceInternational")}
        />
      </div>

      <Input
        label="Tags"
        placeholder="entrepreneurship, creative economy, policy"
        hint="Separate with commas."
        error={errors.tags?.message}
        {...register("tags")}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Body sections</h3>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              append({ heading: "", content: "", pageNumber: fields.length + 1 })
            }
          >
            Add section
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-700">Section {index + 1}</h4>
                {fields.length > 1 && (
                  <button
                    type="button"
                    className="text-xs text-rose-500 hover:underline"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <Input
                label="Heading"
                placeholder="Introduction"
                error={errors.bodySections?.[index]?.heading?.message}
                {...register(`bodySections.${index}.heading`)}
              />
              <Textarea
                label="Content"
                rows={3}
                placeholder="Write the content for this section…"
                error={errors.bodySections?.[index]?.content?.message}
                {...register(`bodySections.${index}.content`)}
              />
              <Input
                label="Page number"
                type="number"
                min={1}
                error={errors.bodySections?.[index]?.pageNumber?.message}
                {...register(`bodySections.${index}.pageNumber`, { valueAsNumber: true })}
              />
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Cover image"
          type="file"
          accept="image/*"
          error={errors.coverImage?.message}
          {...register("coverImage")}
        />
        <Input
          label="PDF manuscript"
          type="file"
          accept="application/pdf"
          error={errors.pdfDocument?.message}
          {...register("pdfDocument")}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader size="sm" />
              Submitting…
            </>
          ) : (
            "Submit article"
          )}
        </Button>
      </div>
    </form>
  );
}