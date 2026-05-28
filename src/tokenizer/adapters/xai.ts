import { estimateStandard } from "../heuristic";
import type { TokenEstimate } from "@/types/phc";
import type { TokenizerAdapter } from "../types";
export const xaiAdapter: TokenizerAdapter = {
  estimate(text): TokenEstimate {
    const inputTokens = estimateStandard(text);
    const contextWindow = 131_072;
    const safeOutputBudget = Math.max(0, Math.min(4096, contextWindow - inputTokens));
    return { family: "xAI Grok", icon: "xai", tokenizerMode: "heuristic", confidence: "Low Confidence", inputTokens, safeOutputBudget, totalEstimate: inputTokens + safeOutputBudget, contextWindow, note: "Grok's tokenizer is not publicly documented.", models: ["Grok-2", "Grok-1.5", "Grok Vision"] };
  },
};
