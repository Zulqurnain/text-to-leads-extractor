# Doctor v3 — 2026-05-14T20:09:55.784854Z mode=diagnose
- commit: 8ce6ed5613e9fd29f307a3ab669234bab74d1bda
- run: https://github.com/Zulqurnain/text-to-leads-extractor/actions/runs/25882921962

## App dir listing (files + dirs)
```
  [dir] node_modules (4096 bytes)
  [dir] public (4096 bytes)
  [dir] scripts (4096 bytes)
  [dir] src (4096 bytes)
  [dir] supabase (4096 bytes)
  [dir] tmp (4096 bytes)
  [file] AGENTS.md (327 bytes)
  [file] CLAUDE.md (11 bytes)
  [file] eslint.config.mjs (465 bytes)
  [file] next.config.ts (200 bytes)
  [file] package-lock.json (327543 bytes)
  [file] package.json (816 bytes)
  [file] postcss.config.mjs (94 bytes)
  [file] README.md (4410 bytes)
  [file] server.js (6946 bytes)
  [file] startup.js (369 bytes)
  [file] tsconfig.json (670 bytes)
```

## .next/ directory
```
  [dir] node_modules
  [dir] server
  [dir] static
  [file] app-path-routes-manifest.json
  [file] build-manifest.json
  [file] BUILD_ID
  [file] package.json
  [file] prerender-manifest.json
  [file] required-server-files.json
  [file] routes-manifest.json
```

## node_modules existence
```
  Found 139 subdirs (showing first 15):
  @huggingface
  @img
  @kwsites
  @next
  @node-llama-cpp
  @reflink
  @swc
  @tinyhttp
  accepts
  ansi-escapes
  ansi-regex
  array-flatten
  async-retry
  body-parser
  bytes
```

## nodevenv/tools.zulqurnainj.com
```
```

## .env content (sanitized)
```
  NEXT_PUBLIC_APP_URL=https://tools.zulqurnainj.com
  DB_HOST=localhost
  DB_USER=your-cpanel-username_toolsu
  DB_PASS=<redacted>
  DB_NAME=your-cpanel-username_toolsdb
  JWT_SECRET=<redacted>
  CV_STORAGE_PATH=/home/your-cpanel-username/tool_cvs
  OFFL_LLAMA_MODEL_DIR=/home/your-cpanel-username/offllama_models
  LLAMA_API_URL=http://YOUR_VPS_IP:8080
  LLAMA_API_KEY=<redacted>
  NODE_ENV=production
  PORT=3000
  HOSTNAME=0.0.0.0
  
```

## startup.js content
```
"use strict";
const fs = require("fs");
const path = require("path");
const envFile = path.join(__dirname, ".env");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf8").split("\n").forEach(line => {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && m[1] && !(m[1] in process.env)) process.env[m[1]] = m[2];
  });
}
require("./server.js");

```

## PassengerApps.list_applications
```
{
  "metadata": {},
  "status": 1,
  "messages": null,
  "warnings": null,
  "data": {
    "tools": {
      "deployment_mode": "production",
      "python": "/usr/bin/python3",
      "name": "tools",
      "enabled": 1,
      "base_uri": "/",
      "envvars": {},
      "deps": {
        "gem": 0,
        "npm": "cd /home/your-cpanel-username/tools.zulqurnainj.com && npm install",
        "pip": 0
      },
      "ruby": "/opt/cpanel/ea-ruby27/root/usr/libexec/passenger-ruby27",
      "path": "/home/your-cpanel-username/tools.zulqurnainj.com",
      "domain": "tools.zulqurnainj.com"
    }
  },
  "errors": null
}
```

## Passenger error log (~/logs/ + ~/.cl.selector/)
```

--- ~/logs directory ---
  ftp.zulqurnainj.com-ftp_log-May-2026.gz (690151 bytes)
  tools.zulqurnainj.com-May-2026.gz (527 bytes)
  tools.zulqurnainj.com-ssl_log-May-2026.gz (1015 bytes)
  zulqurnainj.com-Apr-2026.gz (9182 bytes)
  zulqurnainj.com-May-2026.gz (36054 bytes)
  zulqurnainj.com-ssl_log-Apr-2026.gz (32431 bytes)
  zulqurnainj.com-ssl_log-May-2026.gz (69750 bytes)
```

## SSL.list_certs
```
  domains=['zulqurnainj.com', 'www.zulqurnainj.com'] expires=1794441599
```

## Final external check
```
http://tools.zulqurnainj.com/text-to-leads: timeout/error (code 28)
https://tools.zulqurnainj.com/text-to-leads: timeout/error (code 28)
```