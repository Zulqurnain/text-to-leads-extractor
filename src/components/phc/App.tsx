"use client";
import { useState, useCallback } from "react";
import { PromptInput } from "./PromptInput";
import { HealthScore } from "./HealthScore";
import { ScoreBreakdownCard } from "./ScoreBreakdown";
import { StructureAnalysis } from "./StructureAnalysis";
import { WeakWordsHighlight } from "./WeakWordsHighlight";
import { TokenEstimates } from "./TokenEstimates";
import { Suggestions } from "./Suggestions";
import { RewrittenPromptsCard } from "./RewrittenPrompts";
import { AnalysisSummaryCard } from "./AnalysisSummary";
import { HistoryPanel } from "./HistoryPanel";
import { analyzePrompt } from "@/engine/analyze";
import { saveToHistory, loadHistory, clearHistory } from "@/utils/localStorage";
import type { PromptAnalysisResult, PromptHistoryItem } from "@/types/phc";

export default function PromptHealthCheckerApp() {
  const [result, setResult] = useState<PromptAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [history, setHistory] = useState<PromptHistoryItem[]>(() => loadHistory());

  const handleAnalyze = useCallback((text: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      try {
        const analysis = analyzePrompt(text);
        setResult(analysis);
        saveToHistory(analysis);
        setHistory(loadHistory());
        setTimeout(() => { document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);
      } finally { setIsAnalyzing(false); }
    }, 50);
  }, []);

  const handleHistorySelect = (item: PromptHistoryItem) => { setSelectedPrompt(item.prompt); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleHistoryDelete = (id: string) => { setHistory((prev) => prev.filter((h) => h.id !== id)); };
  const handleHistoryClear = () => { clearHistory(); setHistory([]); };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 20 20" className="w-4 h-4 fill-white"><path d="M4 3h12a1 1 0 011 1v2H3V4a1 1 0 011-1zM3 8h14v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"/></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100 leading-none">Prompt Health Checker</div>
              <div className="text-[10px] text-slate-500 leading-none mt-0.5">prompt analysis tool</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/Zulqurnain/prompt-health-checker" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-300 transition-colors" title="View on GitHub">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 pt-12 pb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Free · No signup · Runs locally
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-3 leading-tight">Prompt Health Checker</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">Analyze prompt quality, estimate tokens across AI model families, and strengthen prompts before sending them to AI.</p>
        </div>
        <PromptInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} initialValue={selectedPrompt} />
      </section>

      {result && (
        <section id="results" className="max-w-5xl mx-auto px-4 pb-12 phc-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs text-slate-600 font-medium uppercase tracking-wider">Analysis Results</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <HealthScore score={result.score} strength={result.strength} wordCount={result.wordCount} charCount={result.charCount} sentenceCount={result.sentenceCount} />
              <ScoreBreakdownCard breakdown={result.breakdown} />
            </div>
            <StructureAnalysis structure={result.structure} />
            <WeakWordsHighlight text={result.prompt} weakWords={result.weakWords} />
            <AnalysisSummaryCard summary={result.summary} costSavingsNote={result.costSavingsNote} />
            <Suggestions suggestions={result.suggestions} />
            <RewrittenPromptsCard rewritten={result.rewritten} />
            <TokenEstimates estimates={result.tokenEstimates} />
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 pb-12">
        <HistoryPanel history={history} onSelect={handleHistorySelect} onDelete={handleHistoryDelete} onClear={handleHistoryClear} />
      </section>

      <footer className="border-t border-slate-800/60 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl mx-auto mb-2">
            <strong className="text-slate-500">Token estimates are approximate.</strong> Consumer AI apps inject hidden system prompts, memory, tools, and agent context. True app-level token counts are not observable from outside the API.
          </p>
          <p className="text-xs text-slate-700">Open source on <a href="https://github.com/Zulqurnain/prompt-health-checker" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors">GitHub</a></p>
        </div>
      </footer>
    </div>
  );
}
