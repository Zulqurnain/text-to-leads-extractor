import { NextRequest, NextResponse } from "next/server";
import { getSession, getUserById } from "@/lib/auth";
import { extractFromText, generateEmail, generateWhatsAppMessage } from "@/lib/llama";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text } = await req.json() as { text?: string };
  if (!text || text.trim().length < 10) {
    return NextResponse.json({ error: "Text too short" }, { status: 400 });
  }

  const user = await getUserById(session.id);
  const cvSummary = (user?.cv_summary as string) ?? "";

  const info = await extractFromText(text);

  const [emailBody, whatsappMessage] = await Promise.all([
    info.emails.length > 0 || info.recruiter_name
      ? generateEmail(info, cvSummary, session.full_name)
      : Promise.resolve(""),
    info.phones.length > 0
      ? generateWhatsAppMessage(info, session.full_name)
      : Promise.resolve(""),
  ]);

  return NextResponse.json({
    extracted: info,
    emailBody,
    whatsappMessage,
    subject: `Application for ${info.job_title || "the advertised position"} — ${session.full_name}`,
  });
}
