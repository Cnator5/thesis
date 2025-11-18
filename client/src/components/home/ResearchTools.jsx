// components/home/ResearchTools.jsx
"use client";

import { ClipboardCheck, FileText, FolderGit2, Lightbulb, ShieldCheck, Users } from "lucide-react";
import Card from "@/components/ui/Card.jsx";

const tools = [
  {
    icon: Lightbulb,
    title: "AI-guided project ideation",
    description:
      "Use curated prompts to translate departmental gaps into actionable project briefs."
  },
  {
    icon: FileText,
    title: "Topic-to-outline generator",
    description:
      "Build structured outlines from topic codes with bibliographic suggestions and page estimates."
  },
  {
    icon: ClipboardCheck,
    title: "Ethics-ready templates",
    description:
      "Download ethics board checklist templates with consent forms tailored to Cameroonian regulations."
  },
  {
    icon: Users,
    title: "Supervisor matchmaking",
    description:
      "Connect students with subject experts, track review cycles, and streamline approvals."
  },
  {
    icon: FolderGit2,
    title: "Versioned document vault",
    description:
      "Keep drafts, field notes, and datasets organised with secure departmental access controls."
  },
  {
    icon: ShieldCheck,
    title: "Plagiarism intelligence",
    description:
      "Integrated originality scanning plus referencing hints before manuscripts reach reviewers."
  }
];

export default function ResearchTools() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tools.map((tool) => (
        <Card key={tool.title} className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <tool.icon size={22} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">{tool.title}</h3>
            <p className="text-sm text-slate-600">{tool.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}