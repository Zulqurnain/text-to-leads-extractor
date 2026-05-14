# tools-doctor diagnostic (UAPI-only)
- timestamp: 2026-05-14T20:02:32.701459Z
- mode: full-fix
- commit: eb14e9890a6dc9646e53c27ba5a79f44576f1d27
- run: https://github.com/Zulqurnain/text-to-leads-extractor/actions/runs/25882558866

## External probes (from runner)
```
DNS: 68.65.120.156   STREAM tools.zulqurnainj.com
http://tools.zulqurnainj.com/text-to-leads: CalledProcessError code=28 stderr=
https://tools.zulqurnainj.com/text-to-leads: CalledProcessError code=28 stderr=
TLS:
subject=CN = *.web-hosting.com
issuer=C = GB, O = Sectigo Limited, CN = Sectigo Public Server Authentication CA DV R36
notBefore=Mar 12 00:00:00 2026 GMT
notAfter=Apr  5 23:59:59 2027 GMT
X509v3 Subject Alternative Name: 
    DNS:*.web-hosting.com, DNS:web-hosting.com

```

## UAPI: PassengerApps.list_applications
```
{
  "warnings": null,
  "data": {
    "tools": {
      "deployment_mode": "production",
      "base_uri": "/",
      "enabled": 1,
      "python": "/usr/bin/python3",
      "name": "tools",
      "deps": {
        "pip": 0,
        "npm": "cd /home/your-cpanel-username/tools.zulqurnainj.com && npm install",
        "gem": 0
      },
      "envvars": {},
      "domain": "tools.zulqurnainj.com",
      "path": "/home/your-cpanel-username/tools.zulqurnainj.com",
      "ruby": "/opt/cpanel/ea-ruby27/root/usr/libexec/passenger-ruby27"
    }
  },
  "errors": null,
  "metadata": {},
  "status": 1,
  "messages": null
}
```

## UAPI: Fileman.get_file_content .htaccess
```
{
  "metadata": {},
  "messages": null,
  "status": 1,
  "warnings": null,
  "errors": null,
  "data": {
    "from_charset": "utf-8",
    "to_charset": "utf-8",
    "dir": "/home/your-cpanel-username/tools.zulqurnainj.com",
    "content": "# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN\nPassengerEnabled On\nPassengerBaseURI /\nPassengerNodejs /home/your-cpanel-username/nodevenv/tools.zulqurnainj.com/22/bin/node\nPassengerAppRoot /home/your-cpanel-username/tools.zulqurnainj.com\nPassengerAppType node\nPassengerStartupFile startup.js\n# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END\n",
    "filename": ".htaccess",
    "path": "/home/your-cpanel-username/tools.zulqurnainj.com/.htaccess"
  }
}
```

## UAPI: Fileman.list_files app dir
```
Found 11 files:
  AGENTS.md (327 bytes)
  CLAUDE.md (11 bytes)
  eslint.config.mjs (465 bytes)
  next.config.ts (200 bytes)
  package-lock.json (327543 bytes)
  package.json (816 bytes)
  postcss.config.mjs (94 bytes)
  README.md (4410 bytes)
  server.js (6946 bytes)
  startup.js (369 bytes)
  tsconfig.json (670 bytes)
```

## UAPI: SSL.list_certs
```
  domains=['zulqurnainj.com', 'www.zulqurnainj.com'] issuer=? expires=1794441599
```

## UAPI: SSL.installed_host
```
{
  "metadata": {},
  "status": 1,
  "messages": null,
  "warnings": null,
  "data": null,
  "errors": null
}
```

## Apply fix-passenger
```
deregister: ok=False
register node 22: ok=False resp={"warnings": null, "data": null, "errors": ["The request failed. (Error ID: 3awymy) Ask your hosting provider to research this error in cPanel & WHM\u2019s main error log."], "metadata": {}, "status":
register node 20: ok=False resp={"metadata": {}, "messages": null, "status": 0, "warnings": null, "errors": ["The request failed. (Error ID: sd7tqw) Ask your hosting provider to research this error in cPanel & WHM\u2019s main error 
register node 18: ok=False resp={"status": 0, "messages": null, "metadata": {}, "data": null, "errors": ["The request failed. (Error ID: bmj28d) Ask your hosting provider to research this error in cPanel & WHM\u2019s main error log.
All registrations returned non-OK — defaulting to 22
Using fallback nodejs_path: /home/your-cpanel-username/nodevenv/tools.zulqurnainj.com/22/bin/node
save_file_content .htaccess: ok=False resp={"status":0,"messages":null,"metadata":{},"data":null,"errors":["The parameter ‘file’ is required."],"warnings":null}

disable: ok=True
enable: ok=True
waiting 20s for Passenger to start app...
HTTP after fix: Command '['curl', '-sk', '-i', '--max-time', '15', 'http://tools.zulqurnainj.com/text-to-leads']' returned non-zero exit status 28.
```

## Apply fix-ssl
```
backup .htaccess: ok=False
minimal .htaccess: ok=False
AutoSSL: ok=False resp={"data":null,"errors":["The system could not find the function “start_autossl_check_cpanel_domains” in the module “SSL”."],"warnings":null,"status":0,"messages":null,"metadata":{}}

LetsEncrypt issue: ok=False resp=CURL_ERR: Command '['curl', '-sk', '-u', 'your-cpanel-username:REDACTED_PASSWORD', 'https://your-hosting-server.com:2083/execute/LetsEncrypt/issue?domains[0]=tools.zulqurnainj.com&keytype=prime256v1']' returned non-zero exit status 3.
waiting 30s for cert provision...
TLS after SSL fix:
subject=CN = *.web-hosting.com
issuer=C = GB, O = Sectigo Limited, CN = Sectigo Public Server Authentication CA DV R36
notBefore=Mar 12 00:00:00 2026 GMT
notAfter=Apr  5 23:59:59 2027 GMT

restore .htaccess: ok=False
```

## Final external check
```
http://tools.zulqurnainj.com/text-to-leads: Command '['curl', '-sk', '-o', '/dev/null', '-w', '%{http_code} %{ssl_verify_result}', '--max-time', '15', 'http://tools.zulqurnainj.com/text-to-leads']' returned non-zero exit status 28.
https://tools.zulqurnainj.com/text-to-leads: Command '['curl', '-sk', '-o', '/dev/null', '-w', '%{http_code} %{ssl_verify_result}', '--max-time', '15', 'https://tools.zulqurnainj.com/text-to-leads']' returned non-zero exit status 28.
```