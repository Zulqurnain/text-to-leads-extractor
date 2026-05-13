const LLAMA_URL = process.env.LLAMA_API_URL!;
const LLAMA_KEY = process.env.LLAMA_API_KEY!;

export interface ExtractedInfo {
  emails: string[];
  phones: string[];
  telegram_usernames: string[];
  recruiter_name: string;
  company: string;
  job_title: string;
  summary: string;
}

export async function extractFromText(text: string): Promise<ExtractedInfo> {
  const prompt = `Extract information from this job post or recruiter message. Return ONLY valid JSON with these fields:
- emails: array of email addresses found
- phones: array of phone numbers found (digits only, with country code)
- telegram_usernames: array of Telegram usernames found (without @)
- recruiter_name: name of the recruiter or hiring manager (empty string if not found)
- company: company name (empty string if not found)
- job_title: job title being advertised (empty string if not found)
- summary: one sentence summary of the opportunity

Text:
${text.slice(0, 3000)}

JSON:`;

  const res = await fetch(`${LLAMA_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(LLAMA_KEY ? { Authorization: `Bearer ${LLAMA_KEY}` } : {}),
    },
    body: JSON.stringify({
      model: "local",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 512,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) throw new Error(`llama.cpp error: ${res.status}`);

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "{}";

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in llama response");

  return JSON.parse(jsonMatch[0]) as ExtractedInfo;
}

export async function generateEmail(
  info: ExtractedInfo,
  cvSummary: string,
  userName: string
): Promise<string> {
  const prompt = `Write a professional job application email. Be concise, friendly, and specific.

Applicant: ${userName}
CV summary: ${cvSummary.slice(0, 500)}
Recruiter: ${info.recruiter_name || "Hiring Manager"}
Company: ${info.company || "your company"}
Role: ${info.job_title || "the advertised position"}
Opportunity summary: ${info.summary}

Write ONLY the email body (no subject line). Start with a greeting. End with a professional sign-off.`;

  const res = await fetch(`${LLAMA_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(LLAMA_KEY ? { Authorization: `Bearer ${LLAMA_KEY}` } : {}),
    },
    body: JSON.stringify({
      model: "local",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) throw new Error(`llama.cpp error: ${res.status}`);

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function generateWhatsAppMessage(
  info: ExtractedInfo,
  userName: string
): Promise<string> {
  const prompt = `Write a short WhatsApp message applying for a job. Max 3 sentences. Be professional but conversational.

Applicant: ${userName}
Company: ${info.company || "your company"}
Role: ${info.job_title || "the advertised position"}

Write ONLY the message text, no quotes.`;

  const res = await fetch(`${LLAMA_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(LLAMA_KEY ? { Authorization: `Bearer ${LLAMA_KEY}` } : {}),
    },
    body: JSON.stringify({
      model: "local",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) throw new Error(`llama.cpp error: ${res.status}`);

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}
