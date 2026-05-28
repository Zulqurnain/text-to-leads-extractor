import { estimateGemini } from "../heuristic";
import type { TokenEstimate } from "@/types/phc";
import type { TokenizerAdapter } from "../types";
export const googleAdapter: TokenizerAdapter = {
  estimate(text): TokenEstimate {
    const inputTokens = estimateGemini(text);
    const contextWindow = 1_000_000;
    const safeOutputBudget = Math.max(0, Math.min(8192, contextWindow - inputTokens));
    return { family: "Google Gemini", icon: "google", tokenizerMode: "gemini_spm", confidence: "Estimated", inputTokens, safeOutputBudget, totalEstimate: inputTokens + safeOutputBudget, contextWindow, note: "Gemini uses a custom SentencePiece tokenizer.", models: ["Gemini 1.5 Pro", "Gemini 1.5 Flash", "Gemini 2.0 Flash"] };
  },
};
