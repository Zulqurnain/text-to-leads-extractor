"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { ExtractedInfo } from "@/lib/llama";

type Connection = { provider: string; email: string } | null;

export default function DashboardPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState<Connection>(null);
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

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/auth/login"); return; }
    });

    fetch("/api/cv").then(r => r.json()).then(d => { if (d.url) setHasCv(true); });

    const supabase2 = createClient();
    supabase2.from("email_connections").select("provider,email").single()
      .then(({ data }) => { if (data) setConnection(data as Connection); });
  }, [router]);

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
        body: JSON.stringify({
          to: selectedEmailTo,
          subject: editedSubject,
          body: editedEmail,
          attachCv,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSendStatus("Email sent!");
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
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  function connectGmail() {
    window.location.href = `/api/auth/gmail/start`;
  }

  function connectOutlook() {
    window.location.href = `/api/auth/outlook/start`;
  }

  return (
    <main className="min-h-screen bg-olive-100 px-4 py-8">
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-olive-900">Apply for Job</h1>
          <button onClick={signOut} className="text-sm text-olive-500 hover:text-olive-800">
            Sign out
          </button>
        </div>

        {/* Email connection */}
        <div className="bg-white rounded-xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-olive-700">Email account</p>
            {connection ? (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                {connection.provider} · {connection.email}
              </span>
            ) : (
              <span className="text-xs text-olive-400">Not connected</span>
            )}
          </div>
          {!connection && (
            <div className="flex gap-2">
              <button onClick={connectGmail}
                className="flex-1 text-sm px-3 py-2 rounded-lg bg-olive-800 text-olive-100 hover:opacity-80 transition-opacity">
                Connect Gmail
              </button>
              <button onClick={connectOutlook}
                className="flex-1 text-sm px-3 py-2 rounded-lg bg-olive-200 text-olive-800 hover:opacity-80 transition-opacity">
                Connect Outlook
              </button>
            </div>
          )}
        </div>

        {/* CV upload */}
        <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-olive-700">Your CV</p>
            <p className="text-xs text-olive-400">{hasCv ? "PDF uploaded" : "No CV uploaded yet"}</p>
          </div>
          <button
            onClick={() => cvInput.current?.click()}
            className="text-sm px-3 py-1.5 rounded-lg bg-olive-200 text-olive-700 hover:opacity-80 transition-opacity"
          >
            {hasCv ? "Replace" : "Upload PDF"}
          </button>
          <input
            ref={cvInput}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) uploadCv(e.target.files[0]); }}
          />
        </div>

        {/* Text input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-olive-700">
            Paste job post or recruiter message
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Paste the LinkedIn post, job listing, or recruiter message here..."
            className="w-full px-3 py-2.5 rounded-xl border border-olive-200 bg-white text-olive-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-olive-400"
          />
          <button
            onClick={handleExtract}
            disabled={loading || !text.trim()}
            className="self-end px-5 py-2.5 rounded-xl bg-olive-800 text-olive-100 font-semibold hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {loading ? "Extracting…" : "Extract & Generate"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="flex flex-col gap-4">
            {/* Summary */}
            {result.extracted.summary && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-olive-400 mb-1">Summary</p>
                <p className="text-sm text-olive-700">{result.extracted.summary}</p>
                {result.extracted.company && (
                  <p className="text-xs text-olive-400 mt-1">
                    {result.extracted.company}
                    {result.extracted.job_title ? ` · ${result.extracted.job_title}` : ""}
                  </p>
                )}
              </div>
            )}

            {/* Email contacts */}
            {result.extracted.emails.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-olive-400">
                  Emails found
                </p>
                {result.extracted.emails.map((email) => (
                  <div key={email} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-olive-800 font-mono">{email}</span>
                    <button
                      onClick={() => openEmailModal(email)}
                      disabled={!connection}
                      className="text-xs px-3 py-1.5 rounded-lg bg-olive-800 text-olive-100 hover:opacity-80 transition-opacity disabled:opacity-40"
                    >
                      {connection ? "Send email" : "Connect email first"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* WhatsApp contacts */}
            {result.extracted.phones.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-olive-400">
                  WhatsApp numbers
                </p>
                {result.extracted.phones.map((phone) => (
                  <div key={phone} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-olive-800 font-mono">{phone}</span>
                    <button
                      onClick={() => { setActivePhone(phone); setModal("whatsapp"); }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-green-700 text-white hover:opacity-80 transition-opacity"
                    >
                      WhatsApp
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Telegram contacts */}
            {result.extracted.telegram_usernames.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-olive-400">
                  Telegram
                </p>
                {result.extracted.telegram_usernames.map((username) => (
                  <div key={username} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-olive-800 font-mono">@{username}</span>
                    <button
                      onClick={() => { setActiveTelegram(username); setModal("telegram"); }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-sky-600 text-white hover:opacity-80 transition-opacity"
                    >
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
              <h2 className="font-semibold text-olive-900">Send email to {selectedEmailTo}</h2>
              <button onClick={() => setModal(null)} className="text-olive-400 hover:text-olive-700 text-xl">&times;</button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-olive-500">Subject</label>
              <input
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="px-3 py-2 rounded-lg border border-olive-200 text-sm text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-olive-500">Email body (editable)</label>
              <textarea
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                rows={10}
                className="px-3 py-2 rounded-lg border border-olive-200 text-sm text-olive-900 resize-none focus:outline-none focus:ring-2 focus:ring-olive-400"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-olive-700 cursor-pointer">
              <input
                type="checkbox"
                checked={attachCv}
                onChange={(e) => setAttachCv(e.target.checked)}
                className="rounded"
              />
              Attach CV {!hasCv && "(no CV uploaded)"}
            </label>

            {sendStatus && (
              <p className={`text-sm px-3 py-2 rounded-lg ${sendStatus.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
                {sendStatus}
              </p>
            )}

            <button
              onClick={sendEmail}
              disabled={sending}
              className="px-4 py-2.5 rounded-xl bg-olive-800 text-olive-100 font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
            >
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
            <p className="text-sm text-olive-600 bg-olive-50 rounded-lg p-3 whitespace-pre-wrap">
              {result.whatsappMessage}
            </p>
            <a
              href={`https://wa.me/${activePhone.replace(/\D/g, "")}?text=${encodeURIComponent(result.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center px-4 py-2.5 rounded-xl bg-green-700 text-white font-semibold hover:opacity-80 transition-opacity"
            >
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
            <p className="text-sm text-olive-600 bg-olive-50 rounded-lg p-3 whitespace-pre-wrap">
              {result.whatsappMessage}
            </p>
            <a
              href={`https://t.me/${activeTelegram}?text=${encodeURIComponent(result.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center px-4 py-2.5 rounded-xl bg-sky-600 text-white font-semibold hover:opacity-80 transition-opacity"
            >
              Open Telegram
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
