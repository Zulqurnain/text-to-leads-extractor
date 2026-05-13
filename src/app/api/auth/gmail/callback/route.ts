import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { exchangeGmailCode } from "@/lib/gmail";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const APP = process.env.NEXT_PUBLIC_APP_URL!;

  if (error || !code) {
    return NextResponse.redirect(new URL("/dashboard?error=gmail_denied", APP));
  }

  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/auth/login", APP));

  const tokens = await exchangeGmailCode(code);

  const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile = await profileRes.json();

  await query(
    `INSERT INTO email_connections (user_id, provider, email, access_token, refresh_token)
     VALUES (?, 'gmail', ?, ?, ?)
     ON DUPLICATE KEY UPDATE provider='gmail', email=VALUES(email),
       access_token=VALUES(access_token), refresh_token=VALUES(refresh_token)`,
    [session.id, profile.email, tokens.access_token, tokens.refresh_token ?? null]
  );

  return NextResponse.redirect(new URL("/dashboard?connected=gmail", APP));
}
