import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { extractFromText, generateEmail, generateWhatsAppMessage } from "@/lib/llama";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { text } = body as { text?: string };
  if (!text || text.trim().length < 10) {
    return NextResponse.json({ error: "Text too short" }, { status: 400 });
  }

  const info = await extractFromText(text);

  // Get user profile for personalised email generation
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, cv_summary")
    .eq("id", user.id)
    .single();

  const userName = profile?.full_name ?? user.email ?? "Applicant";
  const cvSummary = profile?.cv_summary ?? "";

  const [emailBody, whatsappMessage] = await Promise.all([
    info.emails.length > 0 || info.recruiter_name
      ? generateEmail(info, cvSummary, userName)
      : Promise.resolve(""),
    info.phones.length > 0
      ? generateWhatsAppMessage(info, userName)
      : Promise.resolve(""),
  ]);

  return NextResponse.json({
    extracted: info,
    emailBody,
    whatsappMessage,
    subject: `Application for ${info.job_title || "the advertised position"} — ${userName}`,
  });
}
