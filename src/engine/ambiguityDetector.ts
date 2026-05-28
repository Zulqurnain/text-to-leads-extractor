import type { AmbiguityIssue } from "@/types/phc";
import { hasContradictoryInstructions, hasMultipleTasks } from "./normalizer";

const VAGUE_PRONOUNS = /\b(it|this|that|they|them|those|these|something|anything|everything)\b/gi;
const OVERBROAD = /\b(everything|all (of|the)|anything|complete|entire|full|whole|comprehensive)\b/gi;

export function detectAmbiguity(text: string, wordCount: number): AmbiguityIssue[] {
  const issues: AmbiguityIssue[] = [];
  const pronounMatches = text.match(VAGUE_PRONOUNS) ?? [];
  if (pronounMatches.length > 3) {
    issues.push({ type: "vague_pronoun", description: `Found ${pronounMatches.length} vague pronoun(s) (it, this, that, they…) that may cause ambiguity.`, penalty: -2 });
  }
  const overbroadMatches = text.match(OVERBROAD) ?? [];
  if (overbroadMatches.length > 1) {
    issues.push({ type: "overbroad", description: "The prompt uses overbroad scope words (everything, all, entire) which may produce an unfocused response.", penalty: -2 });
  }
  if (hasMultipleTasks(text)) {
    issues.push({ type: "multiple_tasks", description: "The prompt appears to combine multiple distinct tasks. Consider separating them or using numbered steps.", penalty: -4 });
  }
  if (hasContradictoryInstructions(text)) {
    issues.push({ type: "contradictory", description: "Conflicting instructions detected (e.g., 'brief' and 'comprehensive'). The AI will have to guess which to prioritize.", penalty: -5 });
  }
  if (wordCount < 10) {
    issues.push({ type: "unclear_scope", description: "The prompt is very short. It likely lacks sufficient context for the AI to understand your intent precisely.", penalty: -3 });
  }
  return issues;
}
