import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getOutlookAuthUrl } from "@/lib/outlook";

export async function GET(req: NextRequest) {
  void req;
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(
      new URL("/auth/login", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }
  return NextResponse.redirect(getOutlookAuthUrl(String(session.id)));
}
