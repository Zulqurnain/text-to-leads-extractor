import { estimateSentencePiece } from "../heuristic";
import type { TokenEstimate } from "@/types/phc";
import type { TokenizerAdapter } from "../types";
export const mistralAdapter: TokenizerAdapter = {
  estimate(text): TokenEstimate {
    const inputTokens = estimateSentencePiece(text);
    const contextWindow = 32_000;
    const safeOutputBudget = Math.max(0, Math.min(4096, contextWindow - inputTokens));
    return { family: "Mistral", icon: "mistral", tokenizerMode: "sentencepiece", confidence: "Estimated", inputTokens, safeOutputBudget, totalEstimate: inputTokens + safeOutputBudget, contextWindow, note: "Mistral models use a SentencePiece tokenizer.", models: ["Mistral Large", "Mistral 7B", "Mixtral 8x7B"] };
  },
};
