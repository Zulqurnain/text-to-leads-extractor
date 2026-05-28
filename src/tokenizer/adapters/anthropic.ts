import { estimateStandard } from "../heuristic";
import type { TokenEstimate } from "@/types/phc";
import type { TokenizerAdapter } from "../types";
export const anthropicAdapter: TokenizerAdapter = {
  estimate(text): TokenEstimate {
    const inputTokens = estimateStandard(text);
    const contextWindow = 200_000;
    const safeOutputBudget = Math.max(0, Math.min(8192, contextWindow - inputTokens));
    return { family: "Anthropic", icon: "anthropic", tokenizerMode: "cl100k_base", confidence: "Estimated", inputTokens, safeOutputBudget, totalEstimate: inputTokens + safeOutputBudget, contextWindow, note: "Estimated using character/word heuristics. Claude's tokenizer is not publicly released.", models: ["Claude 3.5 Sonnet", "Claude 3.5 Haiku", "Claude 3 Opus"] };
  },
};
