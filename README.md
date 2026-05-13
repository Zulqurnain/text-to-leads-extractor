# Apply for Job Tool

AI-powered job application tool at `tools.zulqurnainj.com`.

Paste any job post or recruiter message → AI extracts emails, WhatsApp numbers, Telegram handles → generates personalised application email with CV → send in one click.

**No Vercel. No Supabase. Runs entirely on your existing Namecheap cPanel hosting.**

## Stack

| Layer | Choice |
|-------|--------|
| Hosting | Namecheap cPanel Node.js App (Passenger) |
| Database | MySQL (included in cPanel) |
| Auth | bcryptjs + JWT (no third-party) |
| CV storage | Server filesystem |
| AI | Self-hosted llama.cpp |
| Email send | Gmail OAuth + Microsoft Graph OAuth |
| Rate limiting | In-memory (no Redis) |

## Setup

### 1. MySQL database

In cPanel → MySQL Databases:
1. Create database: `your-cpanel-username_toolsdb`
2. Create user: `your-cpanel-username_toolsuser` with a strong password
3. Add user to database with ALL privileges
4. Open phpMyAdmin → select the database → SQL tab → paste and run `supabase/schema.sql`

### 2. Node.js App in cPanel

In cPanel → Setup Node.js App:
1. Node.js version: **22** (or latest available)
2. Application mode: **Production**
3. Application root: `tools.zulqurnainj.com` (or wherever you upload the code)
4. Application URL: `tools.zulqurnainj.com`
5. Application startup file: `.next/standalone/server.js`
6. Click **Create**
7. Then add environment variables (see `.env.example`)

### 3. Google OAuth (Gmail)

1. console.cloud.google.com → new project → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: `https://tools.zulqurnainj.com/api/auth/gmail/callback`
4. Enable Gmail API
5. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Node.js App env vars

### 4. Microsoft OAuth (Outlook)

1. portal.azure.com → App registrations → New registration
2. Add redirect URI: `https://tools.zulqurnainj.com/api/auth/outlook/callback`
3. Add API permission: `Mail.Send`, `User.Read`, `offline_access`
4. Create a client secret
5. Add `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_TENANT_ID=common` to env vars

### 5. llama.cpp (self-hosted AI)

```bash
# On any VPS (Oracle Cloud free tier works — 4 OCPU, 24GB RAM)
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp && cmake -B build && cmake --build build -j4
# Download Qwen2.5-1.5B-Instruct-Q4_K_M.gguf (~1GB)
./build/bin/llama-server -m model.gguf --port 8080 --host 0.0.0.0 --api-key YOUR_SECRET_KEY
```

Set `LLAMA_API_URL=http://your-vps-ip:8080` and `LLAMA_API_KEY=YOUR_SECRET_KEY`.

### 6. Deploy to cPanel

```bash
npm run build
# Then upload .next/standalone/ to the server via SFTP:
# sftp -P YOUR_SFTP_PORT your-cpanel-username@your-hosting-server.com
# put -r .next/standalone/ /home/your-cpanel-username/tools.zulqurnainj.com/
```

Create the CV storage directory on the server:
```bash
mkdir -p /home/your-cpanel-username/tool_cvs
chmod 700 /home/your-cpanel-username/tool_cvs
```

Then in cPanel Node.js App, click **Restart**.

## Local development

```bash
cp .env.example .env.local
# Fill in values (use localhost MySQL for local dev)
npm install
npm run dev
```
