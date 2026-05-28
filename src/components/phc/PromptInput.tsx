"use client";
import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";

const EXAMPLES = [
  { label: "Weak", text: "Can you maybe write something about marketing? I kind of need some ideas if possible." },
  { label: "Good", text: "Write 5 short-form social media post ideas for a B2B SaaS product targeting CTOs. Each post should be under 280 characters, use a conversational tone, and include a clear call to action." },
  { label: "Expert", text: "You are a senior content strategist specializing in B2B SaaS go-to-market strategy.\n\nTask: Write a 600-word LinkedIn article targeting CTOs at Series A startups (50-200 employees) about the hidden costs of technical debt.\n\nConstraints:\n- Do not use buzzwords (synergy, leverage, unlock)\n- Include at least one concrete example with numbers\n- End with a clear CTA to book a 15-minute call\n\nFormat: Use markdown with H2 headers. Include a TL;DR at the top.\n\nTone: Professional but approachable — like advice from a trusted peer." },
];

export function PromptInput({ onAnalyze, isAnalyzing, initialValue = "" }: { onAnalyze: (text: string) => void; isAnalyzing: boolean; initialValue?: string }) {
  const [text, setText] = useState(initialValue);
  const ref = useRef<HTMLTextAreaElement>(null);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  useEffect(() => { if (initialValue) setText(initialValue); }, [initialValue]);

  const handle = () => { if (text.trim().length >= 3) onAnalyze(text); };

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Paste Your Prompt</h2>
        <span className="text-xs text-slate-600">Cmd/Ctrl + Enter to analyze</span>
      </div>
      <textarea ref={ref} value={text} onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handle(); }}
        placeholder="Paste your prompt here…"
        className={clsx("w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-4", "text-slate-200 placeholder-slate-600 text-sm leading-relaxed font-mono", "resize-none focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/25", "transition-all min-h-[180px]")} rows={8} />
      <div className="flex items-center justify-between mt-2 mb-4">
        <div className="flex gap-4 text-xs text-slate-600">
          <span><span className="text-slate-400 font-medium">{wordCount}</span> words</span>
          <span><span className="text-slate-400 font-medium">{text.length}</span> chars</span>
          {text.length > 0 && text.length < 50 && <span className="text-orange-400">Too short for accurate analysis</span>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={handle} disabled={isAnalyzing || text.trim().length < 3}
          className={clsx("px-5 py-2.5 rounded-xl font-semibold text-sm transition-all", "bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20", "disabled:opacity-40 disabled:cursor-not-allowed", isAnalyzing && "opacity-70")}>
          {isAnalyzing ? <span className="flex items-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Analyzing…</span> : "Analyze Prompt"}
        </button>
        {text.length > 0 && <button onClick={() => setText("")} className="px-3 py-2.5 text-sm text-slate-500 hover:text-slate-300 transition-colors">Clear</button>}
        <div className="flex flex-wrap gap-2 ml-auto">
          {EXAMPLES.map((ex) => (
            <button key={ex.label} onClick={() => { setText(ex.text); ref.current?.focus(); }}
              className="text-xs text-slate-500 hover:text-sky-400 border border-slate-700/50 hover:border-sky-500/40 px-2.5 py-1 rounded-lg transition-all">
              {ex.label} Prompt
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
