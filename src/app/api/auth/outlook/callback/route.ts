import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createAdminClient } from "@/lib/supabase";
import { exchangeOutlookCode } from "@/lib/outlook";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/dashboard?error=outlook_denied", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(
      new URL("/auth/login", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }

  const tokens = await exchangeOutlookCode(code);

  const profileRes = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile = await profileRes.json();

  const admin = createAdminClient();
  await admin.from("email_connections").upsert(
    {
      user_id: user.id,
      provider: "outlook",
      email: profile.mail ?? profile.userPrincipalName,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    },
    { onConflict: "user_id" }
  );

  return NextResponse.redirect(
    new URL("/dashboard?connected=outlook", process.env.NEXT_PUBLIC_APP_URL!)
  );
}
