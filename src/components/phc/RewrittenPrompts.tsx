"use client";
import { useState } from "react";
import type { RewrittenPrompts } from "@/types/phc";
import { CopyButton } from "./CopyButton";
import { clsx } from "clsx";

type TabKey = "improved" | "concise" | "expert" | "chatgptStyle" | "claudeStyle";
const tabs: Array<{ key: TabKey; label: string; description: string }> = [
  { key: "improved", label: "Improved", description: "Hedging removed, structure added" },
  { key: "concise", label: "Concise", description: "Shortest direct version" },
  { key: "expert", label: "Expert", description: "Full structured prompt" },
  { key: "chatgptStyle", label: "ChatGPT Style", description: "Optimized for GPT models" },
  { key: "claudeStyle", label: "Claude Style", description: "XML-structured for Claude" },
];

export function RewrittenPromptsCard({ rewritten }: { rewritten: RewrittenPrompts }) {
  const [activeTab, setActiveTab] = useState<TabKey>("improved");
  const content = rewritten[activeTab] ?? "";
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Rewritten Prompts</h2>
      <div className="flex flex-wrap gap-1 mb-4 border-b border-slate-800 pb-3">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={clsx("px-3 py-1.5 text-xs font-medium rounded-lg transition-all", activeTab === tab.key ? "bg-sky-500/20 text-sky-300 border border-sky-500/40" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60")}>{tab.label}</button>
        ))}
      </div>
      <p className="text-xs text-slate-500 mb-3">{tabs.find((t) => t.key === activeTab)?.description}</p>
      <div className="relative bg-slate-950/60 rounded-xl p-4 border border-slate-800/60">
        <pre className="text-sm text-slate-200 whitespace-pre-wrap break-words font-mono leading-relaxed pr-16">{content}</pre>
        <div className="absolute top-3 right-3"><CopyButton text={content} /></div>
      </div>
    </div>
  );
}
