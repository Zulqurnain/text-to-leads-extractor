import { estimateSentencePiece } from "../heuristic";
import type { TokenEstimate } from "@/types/phc";
import type { TokenizerAdapter } from "../types";
export const deepseekAdapter: TokenizerAdapter = {
  estimate(text): TokenEstimate {
    const inputTokens = estimateSentencePiece(text);
    const contextWindow = 64_000;
    const safeOutputBudget = Math.max(0, Math.min(4096, contextWindow - inputTokens));
    return { family: "DeepSeek", icon: "deepseek", tokenizerMode: "sentencepiece", confidence: "Estimated", inputTokens, safeOutputBudget, totalEstimate: inputTokens + safeOutputBudget, contextWindow, note: "DeepSeek uses its own SentencePiece-based tokenizer.", models: ["DeepSeek-V3", "DeepSeek-R1", "DeepSeek-V2"] };
  },
};
