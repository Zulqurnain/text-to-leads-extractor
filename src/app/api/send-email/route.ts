import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createAdminClient } from "@/lib/supabase";
import { sendViaGmail, refreshGmailToken } from "@/lib/gmail";
import { sendViaOutlook, refreshOutlookToken } from "@/lib/outlook";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { to, subject, body: emailBody, attachCv } = await req.json() as {
    to: string;
    subject: string;
    body: string;
    attachCv: boolean;
  };

  if (!to || !subject || !emailBody) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: connection } = await admin
    .from("email_connections")
    .select("provider, access_token, refresh_token, email")
    .eq("user_id", user.id)
    .single();

  if (!connection) {
    return NextResponse.json({ error: "No email account connected" }, { status: 400 });
  }

  let cvBase64: string | undefined;
  let cvFilename: string | undefined;

  if (attachCv) {
    const { data: profile } = await admin
      .from("profiles")
      .select("cv_path")
      .eq("id", user.id)
      .single();

    if (profile?.cv_path) {
      const { data: cvData } = await admin.storage
        .from("cvs")
        .download(profile.cv_path);
      if (cvData) {
        const buf = await cvData.arrayBuffer();
        cvBase64 = Buffer.from(buf).toString("base64");
        cvFilename = profile.cv_path.split("/").pop() ?? "cv.pdf";
      }
    }
  }

  if (connection.provider === "gmail") {
    let accessToken = connection.access_token;
    try {
      const refreshed = await refreshGmailToken(connection.refresh_token);
      accessToken = refreshed.access_token;
      await admin
        .from("email_connections")
        .update({ access_token: accessToken })
        .eq("user_id", user.id);
    } catch { /* use existing token */ }

    await sendViaGmail(accessToken, connection.email, to, subject, emailBody, cvBase64, cvFilename);
  } else if (connection.provider === "outlook") {
    let accessToken = connection.access_token;
    try {
      const refreshed = await refreshOutlookToken(connection.refresh_token);
      accessToken = refreshed.access_token;
      await admin
        .from("email_connections")
        .update({ access_token: accessToken })
        .eq("user_id", user.id);
    } catch { /* use existing token */ }

    await sendViaOutlook(accessToken, to, subject, emailBody, cvBase64, cvFilename);
  } else {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
