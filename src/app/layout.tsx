import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Text To Leads Extractor — AI-powered outreach tool",
  description:
    "Paste any job post or recruiter message. AI extracts emails, WhatsApp, and Telegram contacts. Send personalised outreach in one click.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-olive-100 text-olive-800">
        {children}
      </body>
    </html>
  );
}
