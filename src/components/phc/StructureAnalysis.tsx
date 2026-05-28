"use client";
import { clsx } from "clsx";
import type { StructureComponents } from "@/types/phc";

const items: Array<{ key: keyof StructureComponents; label: string; description: string }> = [
  { key: "role", label: "Role", description: "AI persona or expert framing" },
  { key: "task", label: "Task", description: "Clear action verb / primary goal" },
  { key: "context", label: "Context", description: "Background information" },
  { key: "constraints", label: "Constraints", description: "Limits, exclusions, rules" },
  { key: "outputFormat", label: "Output Format", description: "Desired response structure" },
  { key: "examples", label: "Examples", description: "Sample inputs or expected outputs" },
  { key: "audience", label: "Audience", description: "Target reader or user" },
  { key: "tone", label: "Tone", description: "Communication style/voice" },
  { key: "successCriteria", label: "Success Criteria", description: "What a good response looks like" },
];

export function StructureAnalysis({ structure }: { structure: StructureComponents }) {
  const presentCount = Object.values(structure).filter(Boolean).length;
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Structural Components</h2>
        <span className="text-xs text-slate-500">{presentCount} / {items.length} detected</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {items.map(({ key, label, description }) => {
          const present = structure[key];
          return (
            <div key={key} className={clsx("flex items-start gap-2.5 rounded-xl p-3 border", present ? "bg-emerald-500/8 border-emerald-500/25 text-emerald-300" : "bg-slate-800/40 border-slate-700/40 text-slate-500")}>
              <div className={clsx("mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center", present ? "bg-emerald-500/25" : "bg-slate-700/60")}>
                {present ? <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                         : <svg className="w-2.5 h-2.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold">{label}</div>
                <div className={clsx("text-[10px] mt-0.5", present ? "text-emerald-400/70" : "text-slate-600")}>{description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
