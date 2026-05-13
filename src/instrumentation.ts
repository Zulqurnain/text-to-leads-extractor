export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Run DB migrations on server start (idempotent — safe to run every time)
    try {
      const { runMigrations } = await import("./lib/migrate");
      await runMigrations();
    } catch (err) {
      console.error("Migration error (non-fatal):", err);
    }

    // Ensure CV storage directory exists
    try {
      const fs = await import("fs");
      const cvDir = process.env.CV_STORAGE_PATH;
      if (cvDir && !fs.existsSync(cvDir)) {
        fs.mkdirSync(cvDir, { recursive: true, mode: 0o700 });
        console.log("Created CV storage dir:", cvDir);
      }
    } catch (err) {
      console.error("CV dir creation error (non-fatal):", err);
    }

    // Pre-load the AI model in the background so first request is fast
    if (!process.env.LLAMA_API_URL) {
      import("./lib/llama").then(({ warmupModel }) => warmupModel?.()).catch(() => {});
    }
  }
}
