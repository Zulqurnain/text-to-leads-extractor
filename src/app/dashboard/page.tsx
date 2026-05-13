"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ExtractedInfo } from "@/lib/llama";
import { SMTP_PRESETS } from "@/lib/smtp-presets";

type Connection = { label: string; smtp_user: string } | null;

function DashboardContent() {
  const router = useRouter();
  const params = useSearchParams();
  void params;

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState<Connection>(null);
  const [showSmtpForm, setShowSmtpForm] = useState(false);
  const [hasCv, setHasCv] = useState(false);
  const [result, setResult] = useState<{
    extracted: ExtractedInfo;
    emailBody: string;
    whatsappMessage: string;
    subject: string;
  } | null>(null);
  const [modal, setModal] = useState<"email" | "whatsapp" | "telegram" | null>(null);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedSubject, setEditedSubject] = useState("");
  const [selectedEmailTo, setSelectedEmailTo] = useState("");
  const [attachCv, setAttachCv] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const [activePhone, setActivePhone] = useState("");
  const [activeTelegram, setActiveTelegram] = useState("");
  const cvInput = useRef<HTMLInputElement>(null);

  // SMTP form state
  const [smtpPreset, setSmtpPreset] = useState("gmail");
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpSaving, setSmtpSaving] = useState(false);

  // Prefetch/warm up the AI model as soon as the page loads
  useEffect(() => {
    fetch("/api/warmup").catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/cv").then(r => {
      if (r.status === 401) { router.push("/auth/login"); return null; }
      return r.json();
    }).then(d => { if (d?.hasCv) setHasCv(true); });

    fetch("/api/connections").then(r => r.json()).then(d => {
      if (d?.connection) setConnection(d.connection);
    });
  }, [router]);

  function handlePresetChange(preset: string) {
    setSmtpPreset(preset);
    const p = SMTP_PRESETS[preset];
    if (p) { setSmtpHost(p.host); setSmtpPort(p.port); }
  }

  async function saveSmtp(e: React.FormEvent) {
    e.preventDefault();
    setSmtpSaving(true);
    const res = await fetch("/api/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: SMTP_PRESETS[smtpPreset]?.label ?? smtpUser,
        smtp_host: smtpHost,
        smtp_port: smtpPort,
        smtp_user: smtpUser,
        smtp_pass: smtpPass,
      }),
    });
    if (res.ok) {
      setConnection({ label: SMTP_PRESETS[smtpPreset]?.label ?? smtpUser, smtp_user: smtpUser });
      setShowSmtpForm(false);
    }
    setSmtpSaving(false);
  }

  async function handleExtract() {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function openEmailModal(to: string) {
    if (!result) return;
    setSelectedEmailTo(to);
    setEditedEmail(result.emailBody);
    setEditedSubject(result.subject);
    setModal("email");
    setSendStatus(null);
  }

  async function sendEmail() {
    setSending(true);
    setSendStatus(null);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: selectedEmailTo, subject: editedSubject, body: editedEmail, attachCv }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSendStatus("Sent!");
    } catch (e: unknown) {
      setSendStatus("Error: " + (e as Error).message);
    } finally {
      setSending(false);
    }
  }

  async function uploadCv(file: File) {
    const fd = new FormData();
    fd.append("cv", file);
    const res = await fetch("/api/cv", { method: "POST", body: fd });
    if (res.ok) setHasCv(true);
    else alert("CV upload failed");
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-olive-100 px-4 py-8">
      <div className="max-w-xl mx-auto flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-olive-900">Apply for Job</h1>
          <button onClick={signOut} className="text-sm text-olive-500 hover:text-olive-800">Sign out</button>
        </div>

        {/* Email connection */}
        <div className="bg-white rounded-xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-olive-700">Sending email account</p>
            {connection ? (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  {connection.label} · {connection.smtp_user}
                </span>
                <button onClick={() => setShowSmtpForm(true)}
                  className="text-xs text-olive-400 hover:text-olive-700">Change</button>
              </div>
            ) : (
              <button onClick={() => setShowSmtpForm(true)}
                className="text-sm px-3 py-1.5 rounded-lg bg-olive-800 text-olive-100 hover:opacity-80 transition-opacity">
                Connect email
              </button>
            )}
          </div>

          {showSmtpForm && (
            <form onSubmit={saveSmtp} className="flex flex-col gap-3 pt-2 border-t border-olive-100">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-olive-500">Provider</label>
                <select value={smtpPreset} onChange={(e) => handlePresetChange(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-olive-200 text-sm text-olive-900 bg-white focus:outline-none focus:ring-2 focus:ring-olive-400">
                  {Object.entries(SMTP_PRESETS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>

              {smtpPreset === "custom" && (
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-medium text-olive-500">SMTP host</label>
                    <input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} required
                      placeholder="smtp.example.com"
                      className="px-3 py-2 rounded-lg border border-olive-200 text-sm text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-400" />
                  </div>
                  <div className="flex flex-col gap-1 w-20">
                    <label className="text-xs font-medium text-olive-500">Port</label>
                    <input type="number" value={smtpPort} onChange={(e) => setSmtpPort(Number(e.target.value))} required
                      className="px-3 py-2 rounded-lg border border-olive-200 text-sm text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-400" />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-olive-500">Email address</label>
                <input type="email" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} required
                  placeholder="you@gmail.com"
                  className="px-3 py-2 rounded-lg border border-olive-200 text-sm text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-400" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-olive-500">App password</label>
                <input type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} required
                  placeholder="Gmail: myaccount.google.com → App passwords"
                  className="px-3 py-2 rounded-lg border border-olive-200 text-sm text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-400" />
                <p className="text-xs text-olive-400">
                  {smtpPreset === "gmail" && "Gmail → myaccount.google.com → Security → App passwords"}
                  {smtpPreset === "outlook" && "Outlook → account.microsoft.com → Security → App passwords"}
                  {smtpPreset === "yahoo" && "Yahoo → account.yahoo.com → Security → App passwords"}
                  {smtpPreset === "custom" && "Use your email account password or app-specific password"}
                </p>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={smtpSaving}
                  className="flex-1 px-4 py-2 rounded-lg bg-olive-800 text-olive-100 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50">
                  {smtpSaving ? "Saving…" : "Save"}
                </button>
                <button type="button" onClick={() => setShowSmtpForm(false)}
                  className="px-4 py-2 rounded-lg bg-olive-100 text-olive-600 text-sm hover:opacity-80 transition-opacity">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* CV upload */}
        <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-olive-700">Your CV</p>
            <p className="text-xs text-olive-400">{hasCv ? "PDF uploaded" : "No CV yet"}</p>
          </div>
          <button onClick={() => cvInput.current?.click()}
            className="text-sm px-3 py-1.5 rounded-lg bg-olive-200 text-olive-700 hover:opacity-80 transition-opacity">
            {hasCv ? "Replace" : "Upload PDF"}
          </button>
          <input ref={cvInput} type="file" accept="application/pdf" className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) uploadCv(e.target.files[0]); }} />
        </div>

        {/* Text input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-olive-700">Paste job post or recruiter message</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8}
            placeholder="Paste a LinkedIn post, job listing, or recruiter message here..."
            className="w-full px-3 py-2.5 rounded-xl border border-olive-200 bg-white text-olive-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-olive-400" />
          <button
            onClick={handleExtract}
            onMouseEnter={() => fetch("/api/warmup").catch(() => {})}
            onFocus={() => fetch("/api/warmup").catch(() => {})}
            disabled={loading || !text.trim()}
            className="self-end px-5 py-2.5 rounded-xl bg-olive-800 text-olive-100 font-semibold hover:opacity-80 transition-opacity disabled:opacity-40">
            {loading ? "Extracting…" : "Extract & Generate"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="flex flex-col gap-4">
            {result.extracted.summary && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-olive-400 mb-1">Summary</p>
                <p className="text-sm text-olive-700">{result.extracted.summary}</p>
                {result.extracted.company && (
                  <p className="text-xs text-olive-400 mt-1">
                    {result.extracted.company}{result.extracted.job_title ? ` · ${result.extracted.job_title}` : ""}
                  </p>
                )}
              </div>
            )}

            {result.extracted.emails.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-olive-400">Emails found</p>
                {result.extracted.emails.map((email) => (
                  <div key={email} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-olive-800 font-mono">{email}</span>
                    <button onClick={() => openEmailModal(email)} disabled={!connection}
                      className="text-xs px-3 py-1.5 rounded-lg bg-olive-800 text-olive-100 hover:opacity-80 transition-opacity disabled:opacity-40">
                      {connection ? "Send email" : "Connect email first"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {result.extracted.phones.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-olive-400">WhatsApp</p>
                {result.extracted.phones.map((phone) => (
                  <div key={phone} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-olive-800 font-mono">{phone}</span>
                    <button onClick={() => { setActivePhone(phone); setModal("whatsapp"); }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-green-700 text-white hover:opacity-80 transition-opacity">
                      WhatsApp
                    </button>
                  </div>
                ))}
              </div>
            )}

            {result.extracted.telegram_usernames.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-olive-400">Telegram</p>
                {result.extracted.telegram_usernames.map((username) => (
                  <div key={username} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-olive-800 font-mono">@{username}</span>
                    <button onClick={() => { setActiveTelegram(username); setModal("telegram"); }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-sky-600 text-white hover:opacity-80 transition-opacity">
                      Telegram
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Email modal */}
      {modal === "email" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col gap-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-olive-900">Send to {selectedEmailTo}</h2>
              <button onClick={() => setModal(null)} className="text-olive-400 hover:text-olive-700 text-xl">&times;</button>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-olive-500">Subject</label>
              <input value={editedSubject} onChange={(e) => setEditedSubject(e.target.value)}
                className="px-3 py-2 rounded-lg border border-olive-200 text-sm text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-400" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-olive-500">Email body (editable)</label>
              <textarea value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} rows={10}
                className="px-3 py-2 rounded-lg border border-olive-200 text-sm text-olive-900 resize-none focus:outline-none focus:ring-2 focus:ring-olive-400" />
            </div>
            <label className="flex items-center gap-2 text-sm text-olive-700 cursor-pointer">
              <input type="checkbox" checked={attachCv} onChange={(e) => setAttachCv(e.target.checked)} className="rounded" />
              Attach CV {!hasCv && "(no CV uploaded)"}
            </label>
            {sendStatus && (
              <p className={`text-sm px-3 py-2 rounded-lg ${sendStatus.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
                {sendStatus}
              </p>
            )}
            <button onClick={sendEmail} disabled={sending}
              className="px-4 py-2.5 rounded-xl bg-olive-800 text-olive-100 font-semibold hover:opacity-80 transition-opacity disabled:opacity-50">
              {sending ? "Sending…" : "Send email"}
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp modal */}
      {modal === "whatsapp" && result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-olive-900">WhatsApp message</h2>
              <button onClick={() => setModal(null)} className="text-olive-400 hover:text-olive-700 text-xl">&times;</button>
            </div>
            <p className="text-sm text-olive-600 bg-olive-50 rounded-lg p-3 whitespace-pre-wrap">{result.whatsappMessage}</p>
            <a href={`https://wa.me/${activePhone.replace(/\D/g, "")}?text=${encodeURIComponent(result.whatsappMessage)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-center px-4 py-2.5 rounded-xl bg-green-700 text-white font-semibold hover:opacity-80 transition-opacity">
              Open WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Telegram modal */}
      {modal === "telegram" && result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-olive-900">Telegram message</h2>
              <button onClick={() => setModal(null)} className="text-olive-400 hover:text-olive-700 text-xl">&times;</button>
            </div>
            <p className="text-sm text-olive-600 bg-olive-50 rounded-lg p-3 whitespace-pre-wrap">{result.whatsappMessage}</p>
            <a href={`https://t.me/${activeTelegram}?text=${encodeURIComponent(result.whatsappMessage)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-center px-4 py-2.5 rounded-xl bg-sky-600 text-white font-semibold hover:opacity-80 transition-opacity">
              Open Telegram
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

export default function DashboardPage() {
  return <Suspense><DashboardContent /></Suspense>;
}
