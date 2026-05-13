import { NextResponse } from "next/server";

// Called by the browser on page load to pre-warm the AI model.
// Returns immediately — model loads in the background.
export async function GET() {
  // Fire-and-forget warmup (don't await)
  if (!process.env.LLAMA_API_URL) {
    import("../../../lib/llama").then(({ warmupModel }) => warmupModel?.()).catch(() => {});
  }
  return NextResponse.json({ status: "warming" });
}
