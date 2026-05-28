import { normalizePrompt, countWords, countSentences, countChars } from "./normalizer";
import { detectWeakWords } from "./weakWords";
import { detectStructure } from "./structureDetector";
import { detectAmbiguity } from "./ambiguityDetector";
import { calculateBreakdown, calculateTotalScore, getStrengthLabel } from "./scorer";
import { generateSuggestions } from "./suggestionGenerator";
import { rewritePrompt } from "./promptRewriter";
import { generateSummary } from "./summaryGenerator";
import { estimateAllFamilies } from "@/tokenizer/registry";
import type { PromptAnalysisResult } from "@/types/phc";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function buildCostSavingsNote(score: number, weakWordsCount: number, hasOutputFormat: boolean): string {
  const issues: string[] = [];
  if (score < 40) issues.push("low-quality prompts often require 2–3 retry attempts, multiplying your token spend");
  if (weakWordsCount > 3) issues.push("hedge words signal uncertainty to the AI, often producing verbose responses that waste output tokens");
  if (!hasOutputFormat) issues.push("without a format constraint the AI may over-generate, using 2–4x more output tokens than needed");
  if (issues.length === 0) return "This prompt is well-structured and should produce efficient, targeted responses with minimal token waste.";
  return `Potential token waste detected: ${issues.join("; ")}. A stronger prompt typically cuts effective cost per useful response by 30–60%.`;
}

export function analyzePrompt(rawText: string): PromptAnalysisResult {
  const prompt = normalizePrompt(rawText);
  const wordCount = countWords(prompt);
  const charCount = countChars(prompt);
  const sentenceCount = countSentences(prompt);
  const weakWords = detectWeakWords(prompt);
  const structure = detectStructure(prompt);
  const ambiguityIssues = detectAmbiguity(prompt, wordCount);
  const breakdown = calculateBreakdown(prompt, wordCount, structure, weakWords, ambiguityIssues);
  const score = calculateTotalScore(breakdown);
  const strength = getStrengthLabel(score);
  const suggestions = generateSuggestions(structure, weakWords, ambiguityIssues, wordCount, score);
  const rewritten = rewritePrompt(prompt, structure);
  const tokenEstimates = estimateAllFamilies(prompt, wordCount, charCount);
  const summary = generateSummary(structure, weakWords, ambiguityIssues, wordCount, score);
  const costSavingsNote = buildCostSavingsNote(score, weakWords.length, structure.outputFormat);
  return { id: generateId(), timestamp: Date.now(), prompt, wordCount, charCount, sentenceCount, score, strength, breakdown, structure, weakWords, ambiguityIssues, suggestions, rewritten, tokenEstimates, summary, costSavingsNote };
}
