export function estimateTokens(text: string, charsPerToken: number, tokensPerWord: number): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  return Math.max(1, Math.round((chars / charsPerToken + words * tokensPerWord) / 2));
}
export function estimateStandard(text: string): number { return estimateTokens(text, 4.0, 1.33); }
export function estimateSentencePiece(text: string): number { return estimateTokens(text, 3.8, 1.38); }
export function estimateGemini(text: string): number { return estimateTokens(text, 4.1, 1.30); }
