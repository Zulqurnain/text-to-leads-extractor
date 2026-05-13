import { NextResponse, type NextRequest } from "next/server";

const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX = 20; // requests per window per IP

const ipHits = new Map<string, { count: number; reset: number }>();

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const now = Math.floor(Date.now() / 1000);

    const record = ipHits.get(ip);
    if (!record || now > record.reset) {
      ipHits.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW });
    } else {
      record.count++;
      if (record.count > RATE_LIMIT_MAX) {
        return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(record.reset - now),
          },
        });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
