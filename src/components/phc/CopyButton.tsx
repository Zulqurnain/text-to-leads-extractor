"use client";
import { useState } from "react";
import { copyToClipboard } from "@/utils/copy";
import { clsx } from "clsx";

export function CopyButton({ text, className, size = "sm" }: { text: string; className?: string; size?: "sm" | "md" }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  return (
    <button onClick={handleCopy} title="Copy to clipboard" className={clsx("inline-flex items-center gap-1 rounded-md transition-all", size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm", copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-slate-700/60 text-slate-400 border border-slate-600/50 hover:text-slate-200 hover:bg-slate-700", className)}>
      {copied ? (<><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied</>) : (<><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>)}
    </button>
  );
}
