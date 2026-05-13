import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import type { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json() as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const rows = await query<RowDataPacket[]>(
    "SELECT id, email, full_name, password_hash FROM users WHERE email = ?",
    [email.toLowerCase()]
  );

  const user = rows[0];
  if (!user || !(await verifyPassword(password, user.password_hash as string))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await createSession({
    id: user.id as number,
    email: user.email as string,
    full_name: user.full_name as string,
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
