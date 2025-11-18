// components/courses/CourseForm.jsx
"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input.jsx";
import Textarea from "@/components/ui/Textarea.jsx";
import Select from "@/components/ui/Select.jsx";
import Button from "@/components/ui/Button.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import { COURSE_LEVELS } from "@/lib/constants";

const schema = z.object({
  title: z.string().min(3, "Title is required."),
  description: z.string().min(20, "Description should be descriptive."),
  objectives: z.string().optional(),
  prerequisites: z.string().optional(),
  durationWeeks: z.coerce.number().int().min(1, "Duration must be at least 1 week.").optional(),
  level: z.string().min(1, "Select a level."),
  departmentId: z.string().min(1, "Select a department."),
  topicId: z.string().min(1, "Select a topic."),
  price: z.coerce.number().min(0).optional()
});

export default function CourseForm({
  departments,
  topics,
  loading,
  defaultValues,
  onSubmit,
  onCancel
}) {
  const initialValues = useMemo(
    () =>
      defaultValues
        ? {
            title: defaultValues.title ?? "",
            description: defaultValues.description ?? "",
            objectives: (defaultValues.objectives ?? []).join("\n"),
            prerequisites: (defaultValues.prerequisites ?? []).join("\n"),
            durationWeeks: defaultValues.durationWeeks ?? "",
            level: defaultValues.level ?? "Beginner",
            departmentId: defaultValues.department?._id ?? defaultValues.department ?? "",
            topicId: defaultValues.topic?._id ?? defaultValues.topic ?? "",
            price: defaultValues.price ?? 0
          }
        : {
            title: "",
            description: "",
            objectives: "",
            prerequisites: "",
            durationWeeks: "",
            level: "Beginner",
            departmentId: "",
            topicId: "",
            price: 0
          },
    [defaultValues]
  );

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues
  });

  const departmentId = watch("departmentId");
  const filteredTopics = useMemo(() => {
    if (!departmentId) return topics;
    return topics.filter(
      (topic) => topic.department?._id === departmentId || topic.department === departmentId
    );
  }, [departmentId, topics]);

  const submitHandler = (values) => {
    const payload = {
      title: values.title,
      description: values.description,
      objectives: values.objectives
        ? values.objectives.split(/\n|,/).map((item) => item.trim()).filter(Boolean)
        : [],
      prerequisites: values.prerequisites
        ? values.prerequisites.split(/\n|,/).map((item) => item.trim()).filter(Boolean)
        : [],
      durationWeeks: values.durationWeeks ? Number(values.durationWeeks) : undefined,
      level: values.level,
      departmentId: values.departmentId,
      topicId: values.topicId,
      price: values.price ? Number(values.price) : 0
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Title"
          placeholder="Evidence synthesis for public health"
          error={errors.title?.message}
          {...register("title")}
        />
        <Select
          label="Level"
          error={errors.level?.message}
          {...register("level")}
        >
          {COURSE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>
        <Select
          label="Department"
          error={errors.departmentId?.message}
          {...register("departmentId")}
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
      </div>

      <Textarea
        label="Description"
        rows={4}
        placeholder="Describe the course objectives, outcomes, and unique value."
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Textarea
          label="Learning objectives"
          rows={4}
          placeholder="Describe each objective on a new line."
          error={errors.objectives?.message}
          {...register("objectives")}
        />
        <Textarea
          label="Prerequisites"
          rows={4}
          placeholder="List any prerequisites on separate lines."
          error={errors.prerequisites?.message}
          {...register("prerequisites")}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Input
          label="Duration (weeks)"
          type="number"
          min={1}
          placeholder="6"
          error={errors.durationWeeks?.message}
          {...register("durationWeeks", { valueAsNumber: true })}
        />
        <Input
          label="Price (XAF)"
          type="number"
          min={0}
          step={100}
          placeholder="0"
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
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
              Saving…
            </>
          ) : (
            "Save course"
          )}
        </Button>
      </div>
    </form>
  );
}