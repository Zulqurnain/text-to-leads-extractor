export type StrengthLabel = "Weak" | "Fair" | "Good" | "Strong" | "Expert";

export type ConfidenceLevel =
  | "Exact"
  | "High Confidence"
  | "Estimated"
  | "Low Confidence";

export interface ScoreBreakdown {
  clarity: number;
  specificity: number;
  context: number;
  constraints: number;
  outputFormat: number;
  examples: number;
  audience: number;
  tone: number;
  predictability: number;
  completeness: number;
  penalties: number;
}

export interface StructureComponents {
  role: boolean;
  task: boolean;
  context: boolean;
  constraints: boolean;
  outputFormat: boolean;
  examples: boolean;
  audience: boolean;
  tone: boolean;
  successCriteria: boolean;
}

export interface WeakWordMatch {
  word: string;
  index: number;
  length: number;
  reason: string;
}

export interface AmbiguityIssue {
  type: "vague_pronoun" | "unclear_scope" | "multiple_tasks" | "contradictory" | "overbroad";
  description: string;
  penalty: number;
}

export interface SuggestionItem {
  type:
    | "clarify_goal"
    | "specify_output"
    | "add_constraints"
    | "define_audience"
    | "reduce_ambiguity"
    | "remove_hedging"
    | "add_examples"
    | "break_steps"
    | "add_success_criteria"
    | "add_role"
    | "add_context"
    | "add_tone";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
}

export interface RewrittenPrompts {
  improved: string;
  concise: string;
  expert: string;
  chatgptStyle?: string;
  claudeStyle?: string;
}

export interface TokenEstimate {
  family: string;
  icon: string;
  tokenizerMode: "cl100k_base" | "o200k_base" | "sentencepiece" | "gemini_spm" | "heuristic";
  confidence: ConfidenceLevel;
  inputTokens: number;
  safeOutputBudget: number;
  totalEstimate: number;
  contextWindow: number;
  note: string;
  models: string[];
}

export interface AnalysisSummary {
  whatIsGood: string[];
  whatIsWeak: string[];
  ambiguityAreas: string[];
  missingDetails: string[];
  howToImprove: string[];
}

export interface PromptAnalysisResult {
  id: string;
  timestamp: number;
  prompt: string;
  wordCount: number;
  charCount: number;
  sentenceCount: number;
  score: number;
  strength: StrengthLabel;
  breakdown: ScoreBreakdown;
  structure: StructureComponents;
  weakWords: WeakWordMatch[];
  ambiguityIssues: AmbiguityIssue[];
  suggestions: SuggestionItem[];
  rewritten: RewrittenPrompts;
  tokenEstimates: TokenEstimate[];
  summary: AnalysisSummary;
  costSavingsNote: string;
}

export interface PromptHistoryItem {
  id: string;
  timestamp: number;
  prompt: string;
  score: number;
  strength: StrengthLabel;
  wordCount: number;
}
