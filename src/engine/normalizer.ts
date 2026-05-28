export function normalizePrompt(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
export function countSentences(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 2);
  return Math.max(1, sentences.length);
}
export function countChars(text: string): number { return text.length; }
export function extractSentences(text: string): string[] {
  return text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 0);
}
export function hasMultipleTasks(text: string): boolean {
  const conjunctions = [
    /\band (also|additionally|furthermore|moreover)\b/i,
    /\bthen\b.*\band\b/i,
    /\bfirst\b.*\bthen\b.*\bfinally\b/i,
    /\bpart 1\b|\bpart 2\b/i,
    /\btask 1\b|\btask 2\b/i,
    /\b[1-9]\.\s+\w+.*\n[1-9]\.\s+\w+/m,
  ];
  return conjunctions.some((r) => r.test(text));
}
export function hasContradictoryInstructions(text: string): boolean {
  const contradictions = [
    [/\bbrief\b/i, /\bcomprehensive\b/i],
    [/\bshort\b/i, /\bdetailed\b/i],
    [/\bsimple\b/i, /\bexhaustive\b/i],
    [/\bno (code|examples)\b/i, /\bwith (code|examples)\b/i],
    [/\bformal\b/i, /\bcasual\b/i],
  ];
  return contradictions.some(([a, b]) => (a as RegExp).test(text) && (b as RegExp).test(text));
}
