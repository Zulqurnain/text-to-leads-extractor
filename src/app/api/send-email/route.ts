import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { sendViaGmail, refreshGmailToken } from "@/lib/gmail";
import { sendViaOutlook, refreshOutlookToken } from "@/lib/outlook";
import { readFile } from "fs/promises";
import { join } from "path";
import type { RowDataPacket } from "mysql2";

const CV_DIR = process.env.CV_STORAGE_PATH ?? join(process.cwd(), "cv_storage");

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { to, subject, body: emailBody, attachCv } = await req.json() as {
    to: string;
    subject: string;
    body: string;
    attachCv: boolean;
  };

  if (!to || !subject || !emailBody) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const rows = await query<RowDataPacket[]>(
    "SELECT provider, access_token, refresh_token, email FROM email_connections WHERE user_id = ?",
    [session.id]
  );
  const connection = rows[0];
  if (!connection) {
    return NextResponse.json({ error: "No email account connected" }, { status: 400 });
  }

  let cvBase64: string | undefined;
  let cvFilename: string | undefined;

  if (attachCv) {
    const cvRows = await query<RowDataPacket[]>(
      "SELECT cv_path FROM users WHERE id = ?",
      [session.id]
    );
    const cvPath = cvRows[0]?.cv_path as string | null;
    if (cvPath) {
      try {
        const buf = await readFile(join(CV_DIR, cvPath));
        cvBase64 = buf.toString("base64");
        cvFilename = "cv.pdf";
      } catch { /* CV file missing, continue without */ }
    }
  }

  if (connection.provider === "gmail") {
    let accessToken = connection.access_token as string;
    try {
      const refreshed = await refreshGmailToken(connection.refresh_token as string);
      accessToken = refreshed.access_token;
      await query(
        "UPDATE email_connections SET access_token = ? WHERE user_id = ?",
        [accessToken, session.id]
      );
    } catch { /* use existing token */ }

    await sendViaGmail(
      accessToken,
      connection.email as string,
      to, subject, emailBody, cvBase64, cvFilename
    );
  } else if (connection.provider === "outlook") {
    let accessToken = connection.access_token as string;
    try {
      const refreshed = await refreshOutlookToken(connection.refresh_token as string);
      accessToken = refreshed.access_token;
      await query(
        "UPDATE email_connections SET access_token = ? WHERE user_id = ?",
        [accessToken, session.id]
      );
    } catch { /* use existing token */ }

    await sendViaOutlook(accessToken, to, subject, emailBody, cvBase64, cvFilename);
  } else {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
