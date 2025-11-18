"use client";

import dynamic from "next/dynamic";
import { forwardRef, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const DEFAULT_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"]
  ],
  clipboard: {
    matchVisual: false
  }
};

const DEFAULT_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "list",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video"
];

const RichTextEditor = forwardRef(function RichTextEditor(
  {
    label,
    error,
    hint,
    helper,
    className,
    value,
    onChange,
    placeholder,
    readOnly = false,
    modules,
    formats,
    required,
    hideLabel = false,
    ...rest
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);

  const editorModules = useMemo(() => modules ?? DEFAULT_MODULES, [modules]);
  const editorFormats = useMemo(() => formats ?? DEFAULT_FORMATS, [formats]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {!hideLabel && label && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-800">
            {label}
            {required && <span className="ml-1 text-rose-500">*</span>}
          </span>
          {helper}
        </div>
      )}

      <div
        className={cn(
          "quill-rich-text rounded-2xl border border-slate-200 bg-white shadow-sm transition-all",
          "focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100/80",
          readOnly && "pointer-events-none bg-slate-50 text-slate-400",
          error && "border-rose-300 focus-within:border-rose-400 focus-within:ring-rose-100",
          isFocused && !error && "border-indigo-400"
        )}
      >
        <ReactQuill
          ref={ref}
          theme="snow"
          value={value ?? ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={readOnly}
          placeholder={placeholder}
          modules={editorModules}
          formats={editorFormats}
          {...rest}
        />
      </div>

      <div className="flex flex-col gap-1 text-xs">
        {hint && !error && <span className="text-slate-500">{hint}</span>}
        {error && <span className="font-medium text-rose-500">{error}</span>}
      </div>
    </div>
  );
});

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;