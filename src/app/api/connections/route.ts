import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ connection: null });

  const rows = await query<RowDataPacket[]>(
    "SELECT provider, email FROM email_connections WHERE user_id = ?",
    [session.id]
  );

  return NextResponse.json({ connection: rows[0] ?? null });
}
