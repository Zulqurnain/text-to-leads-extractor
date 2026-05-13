export const SMTP_PRESETS: Record<string, { host: string; port: number; label: string }> = {
  gmail:   { host: "smtp.gmail.com",        port: 587, label: "Gmail" },
  outlook: { host: "smtp.office365.com",    port: 587, label: "Outlook / Hotmail" },
  yahoo:   { host: "smtp.mail.yahoo.com",   port: 465, label: "Yahoo Mail" },
  custom:  { host: "",                      port: 587, label: "Other / Custom" },
};
