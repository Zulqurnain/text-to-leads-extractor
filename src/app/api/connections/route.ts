import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ connection: null });

  const rows = await query<RowDataPacket[]>(
    "SELECT label, smtp_user FROM email_connections WHERE user_id = ?",
    [session.id]
  );
  return NextResponse.json({ connection: rows[0] ?? null });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { label, smtp_host, smtp_port, smtp_user, smtp_pass } = await req.json() as {
    label?: string;
    smtp_host?: string;
    smtp_port?: number;
    smtp_user?: string;
    smtp_pass?: string;
  };

  if (!smtp_host || !smtp_user || !smtp_pass) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await query<ResultSetHeader>(
    `INSERT INTO email_connections (user_id, label, smtp_host, smtp_port, smtp_user, smtp_pass)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE label=VALUES(label), smtp_host=VALUES(smtp_host),
       smtp_port=VALUES(smtp_port), smtp_user=VALUES(smtp_user), smtp_pass=VALUES(smtp_pass)`,
    [session.id, label ?? smtp_user, smtp_host, smtp_port ?? 587, smtp_user, smtp_pass]
  );

  return NextResponse.json({ ok: true });
}
