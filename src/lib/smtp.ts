import nodemailer from "nodemailer";
import { readFile } from "fs/promises";
import { join } from "path";

const CV_DIR = process.env.CV_STORAGE_PATH ?? join(process.cwd(), "cv_storage");

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

export async function sendEmail(
  smtp: SmtpConfig,
  to: string,
  subject: string,
  body: string,
  cvPath?: string | null
) {
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  const attachments = [];
  if (cvPath) {
    try {
      const content = await readFile(join(CV_DIR, cvPath));
      attachments.push({ filename: "cv.pdf", content, contentType: "application/pdf" });
    } catch { /* CV missing — send without */ }
  }

  await transporter.sendMail({
    from: smtp.user,
    to,
    subject,
    text: body,
    attachments,
  });
}

export const SMTP_PRESETS: Record<string, { host: string; port: number; label: string }> = {
  gmail:   { host: "smtp.gmail.com",        port: 587, label: "Gmail" },
  outlook: { host: "smtp.office365.com",    port: 587, label: "Outlook / Hotmail" },
  yahoo:   { host: "smtp.mail.yahoo.com",   port: 465, label: "Yahoo Mail" },
  custom:  { host: "",                      port: 587, label: "Other / Custom" },
};
