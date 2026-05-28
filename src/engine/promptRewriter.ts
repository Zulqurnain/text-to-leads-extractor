import type { StructureComponents, RewrittenPrompts } from "@/types/phc";

const HEDGE_REPLACEMENTS: [RegExp, string][] = [
  [/\bcan you\b/gi, ""],
  [/\bplease\b/gi, ""],
  [/\btry to\b/gi, ""],
  [/\bmaybe\b/gi, ""],
  [/\bperhaps\b/gi, ""],
  [/\bprobably\b/gi, ""],
  [/\bif possible\b/gi, ""],
  [/\bsomehow\b/gi, ""],
  [/\bkind of\b/gi, ""],
  [/\bsort of\b/gi, ""],
  [/\bas needed\b/gi, ""],
  [/\bsomething like\b/gi, "similar to"],
  [/\bwhatever works\b/gi, "the best approach"],
  [/\bfeel free to\b/gi, ""],
  [/\bbasically\b/gi, ""],
  [/\bessentially\b/gi, ""],
];

function removeHedging(text: string): string {
  let result = text;
  for (const [pattern, replacement] of HEDGE_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  return result.replace(/\s{2,}/g, " ").trim();
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function rewritePrompt(originalText: string, structure: StructureComponents): RewrittenPrompts {
  const cleaned = removeHedging(originalText);
  const missingParts: string[] = [];
  if (!structure.role) missingParts.push("[Role: You are a ___]");
  if (!structure.outputFormat) missingParts.push("[Output format: Return as ___]");
  if (!structure.constraints) missingParts.push("[Constraints: Limit to ___, avoid ___]");
  const improved = missingParts.length > 0 ? `${missingParts.join(" ")}\n\n${capitalize(cleaned)}` : capitalize(cleaned);

  const firstSentence = cleaned.split(/[.!?]/)[0]?.trim() ?? cleaned;
  const concise = capitalize(firstSentence.length > 120 ? firstSentence.slice(0, 120) + "…" : firstSentence);

  const roleSection = structure.role ? "" : "You are an expert assistant with deep knowledge in the relevant domain.\n\n";
  const taskSection = capitalize(cleaned);
  const formatSection = structure.outputFormat ? "" : "\n\nFormat your response clearly. Use headers, bullet points, or structured sections as appropriate.";
  const constraintSection = structure.constraints ? "" : "\n\nConstraints: Be precise, avoid unnecessary filler, and stay on topic.";
  const successSection = structure.successCriteria ? "" : "\n\nSuccess criteria: Your response should be complete, accurate, and actionable.";
  const expert = `${roleSection}${taskSection}${formatSection}${constraintSection}${successSection}`;

  const chatgptStyle = `Act as an expert in this domain.\n\n${capitalize(cleaned)}\n\nRespond in clear, well-structured prose. Use markdown formatting where helpful.`;
  const claudeStyle = `<task>\n${capitalize(cleaned)}\n</task>\n\n<instructions>\n- Be precise and thorough\n- Use structured output\n- Avoid unnecessary verbosity\n</instructions>\n\n<format>\nRespond with clear sections. Use markdown.\n</format>`;

  return {
    improved: improved.trim(),
    concise: concise.trim(),
    expert: expert.trim(),
    chatgptStyle: chatgptStyle.trim(),
    claudeStyle: claudeStyle.trim(),
  };
}
