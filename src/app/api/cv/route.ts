import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import type { RowDataPacket } from "mysql2";

const CV_DIR = process.env.CV_STORAGE_PATH ?? join(process.cwd(), "cv_storage");

export async function POST(req: NextRequest) {
  const user = await getSession();
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

  await mkdir(CV_DIR, { recursive: true });
  const filename = `${user.id}.pdf`;
  const filepath = join(CV_DIR, filename);
  const bytes = await file.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  await query(
    "UPDATE users SET cv_path = ? WHERE id = ?",
    [filename, user.id]
  );

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await query<RowDataPacket[]>(
    "SELECT cv_path FROM users WHERE id = ?",
    [user.id]
  );
  const cvPath = rows[0]?.cv_path as string | null;

  return NextResponse.json({ hasCv: !!cvPath });
}
