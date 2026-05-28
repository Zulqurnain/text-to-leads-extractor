"use client";
import { useState } from "react";
import type { WeakWordMatch } from "@/types/phc";
import { highlightWeakWords } from "@/engine/weakWords";
import { clsx } from "clsx";

export function WeakWordsHighlight({ text, weakWords }: { text: string; weakWords: WeakWordMatch[] }) {
  const [hoveredReason, setHoveredReason] = useState<string | null>(null);
  const segments = highlightWeakWords(text, weakWords);
  if (weakWords.length === 0) return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Confidence & Weak Wording</h2>
      <div className="flex items-center gap-2 text-emerald-400 text-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
        No hedge or weak words detected. Language is confident and direct.
      </div>
    </div>
  );
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Confidence & Weak Wording</h2>
        <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">{weakWords.length} issue{weakWords.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="bg-slate-950/60 rounded-xl p-4 text-sm text-slate-300 leading-relaxed font-mono mb-4 whitespace-pre-wrap break-words">
        {segments.map((seg, i) => seg.isWeak ? (
          <span key={i} className={clsx("bg-amber-500/25 text-amber-300 border-b-2 border-amber-400 cursor-help rounded-sm px-0.5 transition-all", hoveredReason === seg.reason && "bg-amber-500/40")} onMouseEnter={() => setHoveredReason(seg.reason ?? null)} onMouseLeave={() => setHoveredReason(null)} title={seg.reason}>{seg.text}</span>
        ) : <span key={i}>{seg.text}</span>)}
      </div>
      {hoveredReason && <div className="text-xs text-amber-300 bg-amber-900/20 border border-amber-500/20 rounded-lg px-3 py-2 mb-4">💡 {hoveredReason}</div>}
      <div className="flex flex-wrap gap-2">
        {[...new Map(weakWords.map((w) => [w.word.toLowerCase(), w])).values()].map((m) => (
          <span key={m.word.toLowerCase()} className="inline-flex items-center gap-1 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/25 rounded-full px-2.5 py-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {m.word}
          </span>
        ))}
      </div>
    </div>
  );
}
