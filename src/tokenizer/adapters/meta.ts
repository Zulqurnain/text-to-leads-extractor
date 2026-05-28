import { estimateSentencePiece } from "../heuristic";
import type { TokenEstimate } from "@/types/phc";
import type { TokenizerAdapter } from "../types";
export const metaAdapter: TokenizerAdapter = {
  estimate(text): TokenEstimate {
    const inputTokens = estimateSentencePiece(text);
    const contextWindow = 128_000;
    const safeOutputBudget = Math.max(0, Math.min(4096, contextWindow - inputTokens));
    return { family: "Meta Llama", icon: "meta", tokenizerMode: "sentencepiece", confidence: "Estimated", inputTokens, safeOutputBudget, totalEstimate: inputTokens + safeOutputBudget, contextWindow, note: "Llama 3 uses a tiktoken-compatible BPE tokenizer (vocab 128k).", models: ["Llama 3.1 405B", "Llama 3.1 70B", "Llama 3.2 Vision"] };
  },
};
