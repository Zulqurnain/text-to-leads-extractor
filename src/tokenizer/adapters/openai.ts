import { estimateStandard } from "../heuristic";
import type { TokenEstimate } from "@/types/phc";
import type { TokenizerAdapter } from "../types";
export const openaiAdapter: TokenizerAdapter = {
  estimate(text): TokenEstimate {
    const inputTokens = estimateStandard(text);
    const contextWindow = 128_000;
    const safeOutputBudget = Math.max(0, Math.min(4096, contextWindow - inputTokens));
    return { family: "OpenAI", icon: "openai", tokenizerMode: "cl100k_base", confidence: "Estimated", inputTokens, safeOutputBudget, totalEstimate: inputTokens + safeOutputBudget, contextWindow, note: "Estimated using cl100k_base-like ratio (~4 chars/token).", models: ["GPT-4o", "GPT-4 Turbo", "GPT-4o mini", "GPT-3.5 Turbo"] };
  },
};
