import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { query } from "./db";
import type { RowDataPacket } from "mysql2";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE = "session";

export interface SessionUser {
  id: number;
  email: string;
  full_name: string;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ sub: String(user.id), email: user.email, name: user.full_name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
  return token;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: Number(payload.sub),
      email: payload.email as string,
      full_name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}

export async function getUserById(id: number) {
  const rows = await query<RowDataPacket[]>(
    "SELECT id, email, full_name, cv_path, cv_summary FROM users WHERE id = ?",
    [id]
  );
  return rows[0] ?? null;
}
