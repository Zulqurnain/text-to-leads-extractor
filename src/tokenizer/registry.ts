import { openaiAdapter } from "./adapters/openai";
import { anthropicAdapter } from "./adapters/anthropic";
import { googleAdapter } from "./adapters/google";
import { metaAdapter } from "./adapters/meta";
import { mistralAdapter } from "./adapters/mistral";
import { xaiAdapter } from "./adapters/xai";
import { deepseekAdapter } from "./adapters/deepseek";
import type { TokenEstimate } from "@/types/phc";

const adapters = [openaiAdapter, anthropicAdapter, googleAdapter, metaAdapter, mistralAdapter, xaiAdapter, deepseekAdapter];

export function estimateAllFamilies(text: string, wordCount: number, charCount: number): TokenEstimate[] {
  return adapters.map((adapter) => adapter.estimate(text, wordCount, charCount));
}
