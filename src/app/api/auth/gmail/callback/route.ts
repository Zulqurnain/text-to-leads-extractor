import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createAdminClient } from "@/lib/supabase";
import { exchangeGmailCode } from "@/lib/gmail";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/dashboard?error=gmail_denied", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(
      new URL("/auth/login", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }

  const tokens = await exchangeGmailCode(code);

  // Fetch Gmail address
  const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile = await profileRes.json();

  const admin = createAdminClient();
  await admin.from("email_connections").upsert(
    {
      user_id: user.id,
      provider: "gmail",
      email: profile.email,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    },
    { onConflict: "user_id" }
  );

  return NextResponse.redirect(
    new URL("/dashboard?connected=gmail", process.env.NEXT_PUBLIC_APP_URL!)
  );
}
