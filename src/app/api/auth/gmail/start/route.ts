import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getGmailAuthUrl } from "@/lib/gmail";

export async function GET(req: NextRequest) {
  void req;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(
      new URL("/auth/login", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }
  return NextResponse.redirect(getGmailAuthUrl(user.id));
}
