import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { sendEmail } from "@/lib/smtp";
import type { RowDataPacket } from "mysql2";

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
    "SELECT smtp_host, smtp_port, smtp_user, smtp_pass FROM email_connections WHERE user_id = ?",
    [session.id]
  );
  const conn = rows[0];
  if (!conn) {
    return NextResponse.json({ error: "No email account connected" }, { status: 400 });
  }

  let cvPath: string | null = null;
  if (attachCv) {
    const cvRows = await query<RowDataPacket[]>(
      "SELECT cv_path FROM users WHERE id = ?",
      [session.id]
    );
    cvPath = (cvRows[0]?.cv_path as string) ?? null;
  }

  await sendEmail(
    {
      host: conn.smtp_host as string,
      port: conn.smtp_port as number,
      user: conn.smtp_user as string,
      pass: conn.smtp_pass as string,
    },
    to,
    subject,
    emailBody,
    cvPath
  );

  return NextResponse.json({ ok: true });
}
