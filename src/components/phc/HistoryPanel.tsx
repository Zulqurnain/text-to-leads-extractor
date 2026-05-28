"use client";
import type { PromptHistoryItem } from "@/types/phc";
import { StrengthBadge } from "./Badge";
import { deleteHistoryItem } from "@/utils/localStorage";

export function HistoryPanel({ history, onSelect, onDelete, onClear }: { history: PromptHistoryItem[]; onSelect: (item: PromptHistoryItem) => void; onDelete: (id: string) => void; onClear: () => void }) {
  if (history.length === 0) return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent History</h2>
      <p className="text-xs text-slate-600">No analyses yet. Analyze a prompt to see your history here.</p>
    </div>
  );
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent History</h2>
        <button onClick={onClear} className="text-xs text-slate-600 hover:text-red-400 transition-colors">Clear all</button>
      </div>
      <div className="flex flex-col gap-2">
        {history.map((item) => (
          <div key={item.id} className="flex items-start gap-3 bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 hover:border-slate-600/50 transition-colors group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <StrengthBadge strength={item.strength} />
                <span className="text-xs text-slate-500 tabular-nums">Score: {item.score}</span>
                <span className="text-xs text-slate-600">{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.prompt.slice(0, 150)}{item.prompt.length > 150 ? "…" : ""}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => onSelect(item)} className="text-[10px] text-sky-500 hover:text-sky-300 transition-colors font-medium">Load</button>
              <button onClick={() => { deleteHistoryItem(item.id); onDelete(item.id); }} className="text-[10px] text-slate-600 hover:text-red-400 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
