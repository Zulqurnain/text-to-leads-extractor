"use client";
import type { AnalysisSummary } from "@/types/phc";
import { clsx } from "clsx";

const sectionCfg = {
  good:      { icon: "✓", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20" },
  weak:      { icon: "⚠", color: "text-orange-400",  bg: "bg-orange-500/8 border-orange-500/20" },
  ambiguity: { icon: "?", color: "text-yellow-400",  bg: "bg-yellow-500/8 border-yellow-500/20" },
  missing:   { icon: "○", color: "text-slate-400",   bg: "bg-slate-500/8 border-slate-600/20" },
  improve:   { icon: "→", color: "text-sky-400",     bg: "bg-sky-500/8 border-sky-500/20" },
} as const;

function Section({ title, items, variant }: { title: string; items: string[]; variant: keyof typeof sectionCfg }) {
  const c = sectionCfg[variant];
  return (
    <div className={clsx("rounded-xl border p-4", c.bg)}>
      <h3 className={clsx("text-xs font-semibold uppercase tracking-wider mb-3", c.color)}>{title}</h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 items-start text-sm text-slate-300">
            <span className={clsx("shrink-0 text-xs mt-0.5 w-3", c.color)}>{c.icon}</span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AnalysisSummaryCard({ summary, costSavingsNote }: { summary: AnalysisSummary; costSavingsNote: string }) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">AI Analysis Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="What is Good" items={summary.whatIsGood} variant="good" />
        <Section title="What is Weak" items={summary.whatIsWeak} variant="weak" />
        <Section title="Ambiguity Areas" items={summary.ambiguityAreas} variant="ambiguity" />
        <Section title="Missing Details" items={summary.missingDetails} variant="missing" />
      </div>
      <div className="mt-4"><Section title="How to Improve" items={summary.howToImprove} variant="improve" /></div>
      <div className="mt-4 flex items-start gap-2.5 bg-violet-500/8 border border-violet-500/20 rounded-xl p-4">
        <span className="text-violet-400 text-base shrink-0">💰</span>
        <div><div className="text-xs font-semibold text-violet-400 mb-1 uppercase tracking-wider">Cost Efficiency</div><p className="text-xs text-slate-300 leading-relaxed">{costSavingsNote}</p></div>
      </div>
    </div>
  );
}
