# Apply for Job Tool

AI-powered job application tool at `tools.zulqurnainj.com`.

Paste any job post or recruiter message → AI extracts emails, WhatsApp numbers, Telegram handles → generates personalised application email with CV → send in one click.

## Setup

### 1. Supabase

1. Create a project at supabase.com
2. Run `supabase/schema.sql` in the SQL Editor
3. Create a private storage bucket named `cvs`
4. Copy the project URL and keys to `.env.local`

### 2. Google OAuth (Gmail)

1. console.cloud.google.com → new project → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add redirect URI: `https://tools.zulqurnainj.com/api/auth/gmail/callback`
4. Enable Gmail API
5. Copy client ID and secret to `.env.local`

### 3. Microsoft OAuth (Outlook)

1. portal.azure.com → App registrations → New registration
2. Add redirect URI: `https://tools.zulqurnainj.com/api/auth/outlook/callback`
3. Add API permission: `Mail.Send`, `User.Read`, `offline_access`
4. Copy client ID, secret, tenant ID to `.env.local`

### 4. llama.cpp (self-hosted AI)

```bash
# On your VPS (Oracle Cloud free tier works — 4 OCPU, 24GB RAM)
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp && cmake -B build && cmake --build build -j4
# Download a model (e.g. Qwen2.5-1.5B-Instruct-Q4_K_M.gguf)
./build/bin/llama-server -m model.gguf --port 8080 --host 0.0.0.0 --api-key YOUR_SECRET_KEY
```

Set `LLAMA_API_URL=http://your-vps-ip:8080` and `LLAMA_API_KEY=YOUR_SECRET_KEY` in Vercel.

### 5. Deploy to Vercel

```bash
npx vercel --prod
```

Add all env vars from `.env.example` in Vercel project settings → Environment Variables.

Then add `tools.zulqurnainj.com` as a custom domain (the CNAME is already set via the GitHub Action in the portfolio repo at `zulqurnain/zulqurnainj.com`).

## Local development

```bash
cp .env.example .env.local
# Fill in .env.local values
npm install
npm run dev
```
