import { SCORE_WEIGHTS, PENALTIES, STRENGTH_THRESHOLDS, MIN_PROMPT_WORDS, VERBOSE_THRESHOLD_WORDS } from "@/config/scoring";
import type { ScoreBreakdown, StrengthLabel, StructureComponents, WeakWordMatch, AmbiguityIssue } from "@/types/phc";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function calculateBreakdown(text: string, wordCount: number, structure: StructureComponents, weakWords: WeakWordMatch[], ambiguityIssues: AmbiguityIssue[]): ScoreBreakdown {
  const lower = text.toLowerCase();
  let clarity = 0;
  if (structure.task) clarity += 8;
  if (wordCount >= MIN_PROMPT_WORDS) clarity += 4;
  if (!lower.includes("?") || lower.indexOf("?") === lower.lastIndexOf("?")) clarity += 3;
  clarity = clamp(clarity, 0, SCORE_WEIGHTS.clarity);

  let specificity = 0;
  if (/\d+/.test(text)) specificity += 4;
  if (wordCount >= 30) specificity += 4;
  if (wordCount >= 60) specificity += 3;
  if (/["'`]/.test(text)) specificity += 2;
  if (/\b(specifically|exactly|precisely|in particular)\b/i.test(text)) specificity += 2;
  specificity = clamp(specificity, 0, SCORE_WEIGHTS.specificity);

  let context = 0;
  if (structure.context) context += 7;
  if (wordCount >= 40) context += 3;
  context = clamp(context, 0, SCORE_WEIGHTS.context);

  const constraints = structure.constraints ? clamp(7 + (wordCount >= 30 ? 3 : 0), 0, SCORE_WEIGHTS.constraints) : clamp(wordCount >= 50 ? 2 : 0, 0, SCORE_WEIGHTS.constraints);
  const outputFormat = structure.outputFormat ? SCORE_WEIGHTS.outputFormat : 0;
  const examples = structure.examples ? SCORE_WEIGHTS.examples : 0;
  const audience = structure.audience ? SCORE_WEIGHTS.audience : 0;
  const tone = structure.tone ? SCORE_WEIGHTS.tone : 0;

  let predictability = 0;
  if (structure.role) predictability += 3;
  if (structure.task) predictability += 3;
  if (structure.outputFormat) predictability += 2;
  if (structure.successCriteria) predictability += 2;
  predictability = clamp(predictability, 0, SCORE_WEIGHTS.predictability);

  const presentCount = Object.values(structure).filter(Boolean).length;
  const completeness = clamp(Math.round((presentCount / 9) * SCORE_WEIGHTS.completeness), 0, SCORE_WEIGHTS.completeness);

  const weakWordPenalty = clamp(weakWords.length * PENALTIES.perWeakWord, PENALTIES.maxWeakWordPenalty, 0);
  const ambiguityPenalty = clamp(ambiguityIssues.reduce((sum, i) => sum + i.penalty, 0), PENALTIES.maxAmbiguityPenalty, 0);
  const verbosityPenalty = wordCount > VERBOSE_THRESHOLD_WORDS ? PENALTIES.excessiveVerbosityPenalty : 0;
  const penalties = clamp(weakWordPenalty + ambiguityPenalty + verbosityPenalty, -25, 0);

  return { clarity, specificity, context, constraints, outputFormat, examples, audience, tone, predictability, completeness, penalties };
}

export function calculateTotalScore(breakdown: ScoreBreakdown): number {
  const positive = breakdown.clarity + breakdown.specificity + breakdown.context + breakdown.constraints + breakdown.outputFormat + breakdown.examples + breakdown.audience + breakdown.tone + breakdown.predictability + breakdown.completeness;
  return clamp(Math.round(positive + breakdown.penalties), 0, 100);
}

export function getStrengthLabel(score: number): StrengthLabel {
  if (score >= STRENGTH_THRESHOLDS.Expert) return "Expert";
  if (score >= STRENGTH_THRESHOLDS.Strong) return "Strong";
  if (score >= STRENGTH_THRESHOLDS.Good) return "Good";
  if (score >= STRENGTH_THRESHOLDS.Fair) return "Fair";
  return "Weak";
}
