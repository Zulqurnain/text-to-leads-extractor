import { STRUCTURE_PATTERNS } from "@/config/scoring";
import type { StructureComponents } from "@/types/phc";

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

export function detectStructure(text: string): StructureComponents {
  return {
    role: matchesAny(text, STRUCTURE_PATTERNS.role),
    task: matchesAny(text, STRUCTURE_PATTERNS.task),
    context: matchesAny(text, STRUCTURE_PATTERNS.context),
    constraints: matchesAny(text, STRUCTURE_PATTERNS.constraints),
    outputFormat: matchesAny(text, STRUCTURE_PATTERNS.outputFormat),
    examples: matchesAny(text, STRUCTURE_PATTERNS.examples),
    audience: matchesAny(text, STRUCTURE_PATTERNS.audience),
    tone: matchesAny(text, STRUCTURE_PATTERNS.tone),
    successCriteria: matchesAny(text, STRUCTURE_PATTERNS.successCriteria),
  };
}
