import type { AnalysisSummary, StructureComponents, WeakWordMatch, AmbiguityIssue } from "@/types/phc";

export function generateSummary(structure: StructureComponents, weakWords: WeakWordMatch[], ambiguityIssues: AmbiguityIssue[], wordCount: number, score: number): AnalysisSummary {
  const whatIsGood: string[] = [];
  const whatIsWeak: string[] = [];
  const ambiguityAreas: string[] = [];
  const missingDetails: string[] = [];
  const howToImprove: string[] = [];

  if (structure.task) whatIsGood.push("Clear primary task with an action verb.");
  if (structure.role) whatIsGood.push("Role definition helps anchor the AI's perspective.");
  if (structure.outputFormat) whatIsGood.push("Output format is specified — reduces guesswork.");
  if (structure.constraints) whatIsGood.push("Constraints limit the AI's scope, improving precision.");
  if (structure.context) whatIsGood.push("Background context is provided.");
  if (structure.examples) whatIsGood.push("Examples are included, which significantly improves response quality.");
  if (structure.audience) whatIsGood.push("Target audience is defined.");
  if (structure.tone) whatIsGood.push("Tone/style is specified.");
  if (structure.successCriteria) whatIsGood.push("Success criteria are defined.");
  if (weakWords.length === 0) whatIsGood.push("No hedge or weak words detected — language is confident.");
  if (wordCount >= 30 && wordCount <= 300) whatIsGood.push("Prompt length is appropriate — not too short or verbose.");
  if (whatIsGood.length === 0) whatIsGood.push("A task-like intent is present in the prompt.");

  if (!structure.task) whatIsWeak.push("No clear action verb or task statement found.");
  if (!structure.role) whatIsWeak.push("No role or persona defined for the AI.");
  if (!structure.outputFormat) whatIsWeak.push("Output format is unspecified — AI will choose its own structure.");
  if (!structure.constraints) whatIsWeak.push("No constraints — output scope is fully open-ended.");
  if (weakWords.length > 0) whatIsWeak.push(`${weakWords.length} hedge/weak word(s) add uncertainty (${[...new Set(weakWords.map(w => w.word.toLowerCase()))].slice(0, 5).join(", ")}).`);
  if (wordCount < 15) whatIsWeak.push("Prompt is too short to give the AI enough direction.");
  if (!structure.context && wordCount < 50) whatIsWeak.push("No background context — AI must make assumptions about your situation.");
  if (whatIsWeak.length === 0 && score < 60) whatIsWeak.push("Several structural prompt elements are missing.");

  for (const issue of ambiguityIssues) ambiguityAreas.push(issue.description);
  if (ambiguityAreas.length === 0) ambiguityAreas.push("No major ambiguity detected in this prompt.");

  if (!structure.role) missingDetails.push("Role or expert persona for the AI");
  if (!structure.context) missingDetails.push("Background context or situation");
  if (!structure.outputFormat) missingDetails.push("Desired output format (JSON, list, report, etc.)");
  if (!structure.constraints) missingDetails.push("Constraints, limits, or exclusions");
  if (!structure.examples) missingDetails.push("Examples of desired input/output");
  if (!structure.audience) missingDetails.push("Target audience for the response");
  if (!structure.successCriteria) missingDetails.push("Success criteria or acceptance conditions");
  if (missingDetails.length === 0) missingDetails.push("All major structural components are present.");

  howToImprove.push(
    "Start with a clear role: 'You are an expert in [domain]…'",
    "Use direct imperative: 'Write', 'Generate', 'Analyze' — not 'Can you try to maybe…'",
    "Always specify the output format to avoid unpredictable structure.",
    "Add at least one concrete constraint to narrow the scope.",
  );
  if (!structure.examples) howToImprove.push("Provide a short example of what good output looks like.");
  if (weakWords.length > 2) howToImprove.push("Replace hedge words with confident, direct language.");

  return { whatIsGood, whatIsWeak, ambiguityAreas, missingDetails, howToImprove };
}
