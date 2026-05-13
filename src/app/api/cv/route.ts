import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("cv") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files allowed" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const admin = createAdminClient();
  const path = `${user.id}/cv.pdf`;

  const { error: uploadError } = await admin.storage
    .from("cvs")
    .upload(path, file, { upsert: true, contentType: "application/pdf" });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  await admin
    .from("profiles")
    .upsert({ id: user.id, cv_path: path }, { onConflict: "id" });

  return NextResponse.json({ ok: true, path });
}

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("cv_path")
    .eq("id", user.id)
    .single();

  if (!profile?.cv_path) {
    return NextResponse.json({ url: null });
  }

  const { data } = await admin.storage
    .from("cvs")
    .createSignedUrl(profile.cv_path, 3600);

  return NextResponse.json({ url: data?.signedUrl ?? null });
}
