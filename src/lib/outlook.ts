const TENANT = process.env.MICROSOFT_TENANT_ID ?? "common";

export function getOutlookAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    response_type: "code",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/outlook/callback`,
    scope: "Mail.Send User.Read offline_access",
    state,
  });
  return `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/authorize?${params}`;
}

export async function exchangeOutlookCode(code: string) {
  const res = await fetch(
    `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/outlook/callback`,
        grant_type: "authorization_code",
      }),
    }
  );
  if (!res.ok) throw new Error(`Outlook token exchange failed: ${res.status}`);
  return res.json();
}

export async function refreshOutlookToken(refreshToken: string) {
  const res = await fetch(
    `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        grant_type: "refresh_token",
        scope: "Mail.Send User.Read offline_access",
      }),
    }
  );
  if (!res.ok) throw new Error(`Outlook token refresh failed: ${res.status}`);
  return res.json();
}

export async function sendViaOutlook(
  accessToken: string,
  to: string,
  subject: string,
  body: string,
  cvBase64?: string,
  cvFilename?: string
) {
  const message: Record<string, unknown> = {
    subject,
    body: { contentType: "Text", content: body },
    toRecipients: [{ emailAddress: { address: to } }],
  };

  if (cvBase64 && cvFilename) {
    message.attachments = [
      {
        "@odata.type": "#microsoft.graph.fileAttachment",
        name: cvFilename,
        contentType: "application/pdf",
        contentBytes: cvBase64,
      },
    ];
  }

  const res = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Outlook send failed: ${err}`);
  }
}
