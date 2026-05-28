import { WEAK_WORDS } from "@/config/scoring";
import type { WeakWordMatch } from "@/types/phc";

export function detectWeakWords(text: string): WeakWordMatch[] {
  const matches: WeakWordMatch[] = [];
  const seen = new Set<number>();
  for (const { pattern, reason } of WEAK_WORDS) {
    pattern.lastIndex = 0;
    const globalPattern = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
    let match: RegExpExecArray | null;
    while ((match = globalPattern.exec(text)) !== null) {
      if (!seen.has(match.index)) {
        seen.add(match.index);
        matches.push({ word: match[0], index: match.index, length: match[0].length, reason });
      }
    }
  }
  return matches.sort((a, b) => a.index - b.index);
}

export function highlightWeakWords(
  text: string,
  matches: WeakWordMatch[]
): Array<{ text: string; isWeak: boolean; reason?: string }> {
  if (matches.length === 0) return [{ text, isWeak: false }];
  const segments: Array<{ text: string; isWeak: boolean; reason?: string }> = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.index > cursor) segments.push({ text: text.slice(cursor, match.index), isWeak: false });
    segments.push({ text: text.slice(match.index, match.index + match.length), isWeak: true, reason: match.reason });
    cursor = match.index + match.length;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), isWeak: false });
  return segments;
}
