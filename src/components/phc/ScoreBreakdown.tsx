"use client";
import { clsx } from "clsx";
import type { ScoreBreakdown } from "@/types/phc";
import { SCORE_WEIGHTS } from "@/config/scoring";

const dims: Array<{ key: keyof Omit<ScoreBreakdown, "penalties">; label: string }> = [
  { key: "clarity", label: "Clarity" }, { key: "specificity", label: "Specificity" },
  { key: "context", label: "Context" }, { key: "constraints", label: "Constraints" },
  { key: "outputFormat", label: "Output Format" }, { key: "examples", label: "Examples" },
  { key: "audience", label: "Audience" }, { key: "tone", label: "Tone" },
  { key: "predictability", label: "Predictability" }, { key: "completeness", label: "Completeness" },
];

function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-500";
  const textColor = pct >= 70 ? "text-emerald-400" : pct >= 40 ? "text-yellow-400" : "text-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-xs text-slate-400 text-right shrink-0">{label}</div>
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={clsx("h-full rounded-full transition-all duration-500", color)} style={{ width: `${pct}%` }} />
      </div>
      <div className="w-12 text-right text-xs tabular-nums"><span className={textColor}>{value}</span><span className="text-slate-600">/{max}</span></div>
    </div>
  );
}

export function ScoreBreakdownCard({ breakdown }: { breakdown: ScoreBreakdown }) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">Score Breakdown</h2>
      <div className="flex flex-col gap-3">
        {dims.map(({ key, label }) => <Bar key={key} value={breakdown[key]} max={SCORE_WEIGHTS[key]} label={label} />)}
        {breakdown.penalties < 0 && (
          <div className="flex items-center gap-3 mt-1 pt-3 border-t border-slate-800">
            <div className="w-28 text-xs text-red-400 text-right shrink-0">Penalties</div>
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-red-600 ml-auto" style={{ width: `${Math.abs(breakdown.penalties) / 25 * 100}%` }} />
            </div>
            <div className="w-12 text-right text-xs tabular-nums text-red-400">{breakdown.penalties}</div>
          </div>
        )}
      </div>
    </div>
  );
}
