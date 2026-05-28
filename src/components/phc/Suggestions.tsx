"use client";
import { clsx } from "clsx";
import type { SuggestionItem } from "@/types/phc";

const pCfg = { high: { label: "High", class: "text-red-400 bg-red-500/10 border-red-500/25" }, medium: { label: "Medium", class: "text-yellow-400 bg-yellow-500/10 border-yellow-500/25" }, low: { label: "Low", class: "text-slate-400 bg-slate-500/10 border-slate-500/25" } };

export function Suggestions({ suggestions }: { suggestions: SuggestionItem[] }) {
  if (suggestions.length === 0) return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Improvement Suggestions</h2>
      <p className="text-emerald-400 text-sm">This prompt is already well-structured. No major improvements needed.</p>
    </div>
  );
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Improvement Suggestions</h2>
        <span className="text-xs text-slate-500">{suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="flex flex-col gap-3">
        {suggestions.map((s, i) => {
          const p = pCfg[s.priority];
          return (
            <div key={i} className="flex gap-3 bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 hover:border-slate-600/50 transition-colors">
              <div className="shrink-0 mt-0.5"><div className={clsx("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border", p.class)}>{i + 1}</div></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-slate-200">{s.title}</span>
                  <span className={clsx("text-[10px] font-medium px-1.5 py-0.5 rounded-full border", p.class)}>{p.label} Priority</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
