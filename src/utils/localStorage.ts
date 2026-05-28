import type { PromptHistoryItem, PromptAnalysisResult } from "@/types/phc";

const HISTORY_KEY = "phc_history_v1";
const MAX_HISTORY = 20;

export function saveToHistory(result: PromptAnalysisResult): void {
  const item: PromptHistoryItem = { id: result.id, timestamp: result.timestamp, prompt: result.prompt, score: result.score, strength: result.strength, wordCount: result.wordCount };
  const existing = loadHistory();
  const updated = [item, ...existing.filter((h) => h.id !== item.id)].slice(0, MAX_HISTORY);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated.slice(0, 5))); } catch {} }
}

export function loadHistory(): PromptHistoryItem[] {
  try { const raw = localStorage.getItem(HISTORY_KEY); if (!raw) return []; return JSON.parse(raw) as PromptHistoryItem[]; } catch { return []; }
}

export function deleteHistoryItem(id: string): void {
  const updated = loadHistory().filter((h) => h.id !== id);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch {}
}

export function clearHistory(): void {
  try { localStorage.removeItem(HISTORY_KEY); } catch {}
}
