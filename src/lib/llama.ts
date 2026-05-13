/**
 * LLM client for the apply-for-job tool.
 *
 * Mode A — offLLama embedded: no LLAMA_API_URL set.
 *   Loads the model directly in this process via the offllama npm package.
 *   Model auto-downloads to OFFL_LLAMA_MODEL_DIR on first use (~400MB, once).
 *
 * Mode B — HTTP (offLLama server or any OpenAI-compatible endpoint):
 *   Set LLAMA_API_URL to the server URL (e.g. http://localhost:8080).
 */

export interface ExtractedInfo {
  emails: string[];
  phones: string[];
  telegram_usernames: string[];
  recruiter_name: string;
  company: string;
  job_title: string;
  summary: string;
}

// ── Embedded offLLama singleton ───────────────────────────────────────────────
let embeddedEngine: import("offllama").LlamaEngine | null = null;
let engineLoading: Promise<import("offllama").LlamaEngine> | null = null;

async function getEmbeddedEngine(): Promise<import("offllama").LlamaEngine> {
  if (embeddedEngine) return embeddedEngine;
  if (engineLoading) return engineLoading;

  engineLoading = (async () => {
    const { LlamaEngine } = await import("offllama");
    const engine = new LlamaEngine({
      modelPath: process.env.OFFL_LLAMA_MODEL_PATH,
      contextSize: parseInt(process.env.OFFL_LLAMA_CONTEXT_SIZE ?? "2048", 10),
    });
    await engine.load(true); // auto-download if missing
    embeddedEngine = engine;
    return engine;
  })();

  return engineLoading;
}

// ── Core chat helper ──────────────────────────────────────────────────────────
async function chat(messages: Array<{ role: "system" | "user" | "assistant"; content: string }>, opts?: { temperature?: number; maxTokens?: number }): Promise<string> {
  const url = process.env.LLAMA_API_URL;

  if (url) {
    // Mode B: HTTP
    const key = process.env.LLAMA_API_KEY;
    const res = await fetch(`${url}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
      },
      body: JSON.stringify({
        model: "local",
        messages,
        temperature: opts?.temperature ?? 0.7,
        max_tokens: opts?.maxTokens ?? 512,
      }),
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) throw new Error(`LLM HTTP error: ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  // Mode A: embedded offLLama
  const engine = await getEmbeddedEngine();
  return engine.chat(messages, {
    temperature: opts?.temperature ?? 0.7,
    maxTokens: opts?.maxTokens ?? 512,
  });
}

/** Pre-warm the embedded model so the first user request is fast. */
export async function warmupModel(): Promise<void> {
  if (process.env.LLAMA_API_URL) return; // HTTP mode — nothing to warm
  try {
    console.log("offLLama: pre-loading model in background...");
    await getEmbeddedEngine();
    console.log("offLLama: model warm and ready");
  } catch (err) {
    console.error("offLLama warmup failed (non-fatal):", err);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function extractFromText(text: string): Promise<ExtractedInfo> {
  const content = await chat([
    {
      role: "user",
      content: `Extract information from this job post or recruiter message. Return ONLY valid JSON:
{"emails":[],"phones":[],"telegram_usernames":[],"recruiter_name":"","company":"","job_title":"","summary":""}

Text:
${text.slice(0, 3000)}

JSON:`,
    },
  ], { temperature: 0.1, maxTokens: 512 });

  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON in LLM response");
  return JSON.parse(match[0]) as ExtractedInfo;
}

export async function generateEmail(info: ExtractedInfo, cvSummary: string, userName: string): Promise<string> {
  return chat([
    {
      role: "user",
      content: `Write a professional job application email. Be concise and specific.

Applicant: ${userName}
CV summary: ${cvSummary.slice(0, 500)}
Recruiter: ${info.recruiter_name || "Hiring Manager"}
Company: ${info.company || "your company"}
Role: ${info.job_title || "the advertised position"}
Opportunity: ${info.summary}

Write ONLY the email body (no subject line). Start with a greeting.`,
    },
  ], { temperature: 0.7, maxTokens: 600 });
}

export async function generateWhatsAppMessage(info: ExtractedInfo, userName: string): Promise<string> {
  return chat([
    {
      role: "user",
      content: `Write a short WhatsApp job application message. Max 3 sentences. Professional but conversational.

Applicant: ${userName}
Company: ${info.company || "your company"}
Role: ${info.job_title || "the advertised position"}

Write ONLY the message text.`,
    },
  ], { temperature: 0.7, maxTokens: 150 });
}
