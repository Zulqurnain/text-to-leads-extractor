import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-olive-100">
      <div className="max-w-xl w-full flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-olive-500">
            by Zulqurnain Haider
          </span>
          <h1 className="text-4xl font-bold text-olive-900 leading-tight">
            Apply for Job
          </h1>
          <p className="text-olive-600 text-lg leading-relaxed">
            Paste any job post or LinkedIn message. AI extracts recruiter
            emails, WhatsApp numbers and Telegram handles — then generates a
            personalised application email with your CV attached, sent in one
            click.
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          {[
            "Connect Gmail, Outlook, or Yahoo — send from your own address",
            "AI extracts emails, phones, and Telegram usernames from any text",
            "Auto-generated personalised email with your CV attached",
            "One-click WhatsApp and Telegram links with pre-filled message",
            "Upload your CV once — reused for every application",
          ].map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-olive-700">
              <span className="text-olive-400 mt-0.5 flex-shrink-0">—</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/auth/signup"
            className="flex-1 text-center px-6 py-3 rounded-xl bg-olive-800 text-olive-100 font-semibold hover:opacity-80 transition-opacity"
          >
            Get started free
          </Link>
          <Link
            href="/auth/login"
            className="flex-1 text-center px-6 py-3 rounded-xl bg-olive-200 text-olive-800 font-medium hover:opacity-80 transition-opacity"
          >
            Sign in
          </Link>
        </div>

        <p className="text-xs text-olive-400 text-center">
          Built with self-hosted AI — your data stays private.
        </p>
      </div>
    </main>
  );
}
