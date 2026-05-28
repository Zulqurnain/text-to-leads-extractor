"use client";
import { clsx } from "clsx";
import type { StrengthLabel, ConfidenceLevel } from "@/types/phc";

const strengthColors: Record<StrengthLabel, string> = {
  Weak: "bg-red-500/15 text-red-400 border-red-500/30",
  Fair: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Good: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Strong: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Expert: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const confidenceColors: Record<ConfidenceLevel, string> = {
  Exact: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "High Confidence": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Estimated: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Low Confidence": "bg-red-500/15 text-red-400 border-red-500/30",
};

const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border";

export function StrengthBadge({ strength }: { strength: StrengthLabel }) {
  return <span className={clsx(base, strengthColors[strength])}>{strength}</span>;
}

export function ConfidenceBadge({ confidence }: { confidence: ConfidenceLevel }) {
  return <span className={clsx(base, confidenceColors[confidence])}>{confidence}</span>;
}
