// components/books/PdfViewer.jsx
"use client";

export default function PdfViewer({ src, title = "Document preview" }) {
  if (!src) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
        No digital copy available.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <object
        data={`${src}#toolbar=0&navpanes=0`}
        type="application/pdf"
        width="100%"
        height="640"
      >
        <p className="p-6 text-sm text-slate-500">
          Unable to display the PDF in this browser.{" "}
          <a href={src} target="_blank" rel="noreferrer" className="font-semibold text-indigo-600">
            Download {title}
          </a>
        </p>
      </object>
    </div>
  );
}