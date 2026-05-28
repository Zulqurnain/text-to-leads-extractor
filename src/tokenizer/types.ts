export type TokenizerMode = "cl100k_base" | "o200k_base" | "sentencepiece" | "gemini_spm" | "heuristic";
export interface TokenizerAdapter {
  estimate(text: string, wordCount: number, charCount: number): import("@/types/phc").TokenEstimate;
}
