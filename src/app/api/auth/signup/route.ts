import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export async function POST(req: NextRequest) {
  const { email, password, full_name } = await req.json() as {
    email?: string;
    password?: string;
    full_name?: string;
  };

  if (!email || !password || !full_name || password.length < 8) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await query<RowDataPacket[]>(
    "SELECT id FROM users WHERE email = ?",
    [email.toLowerCase()]
  );
  if (existing.length > 0) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const hash = await hashPassword(password);
  const result = await query<ResultSetHeader>(
    "INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)",
    [email.toLowerCase(), hash, full_name]
  );

  const user = { id: result.insertId, email: email.toLowerCase(), full_name };
  const token = await createSession(user);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
