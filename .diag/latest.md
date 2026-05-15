# Doctor v5 — 2026-05-14T23:58:17.901991Z mode=try-paths
- run: https://github.com/Zulqurnain/text-to-leads-extractor/actions/runs/25892540724

## PassengerApps.ensure_deps_are_installed
```
{
  "warnings": null,
  "data": null,
  "errors": [
    "The system could not find the function \u201censure_deps_are_installed\u201d in the module \u201cPassengerApps\u201d."
  ],
  "metadata": {},
  "status": 0,
  "messages": null
}
```

## Probing node binary paths (via get_file_content)
```
  ✗ /opt/cpanel/ea-nodejs22/bin/node (The directory “/home/your-cpanel-username/opt/cpanel/ea-nodejs22/bin” does not exist.)
  ✗ /opt/cpanel/ea-nodejs20/bin/node (The directory “/home/your-cpanel-username/opt/cpanel/ea-nodejs20/bin” does not exist.)
  ✗ /opt/cpanel/ea-nodejs18/bin/node (The directory “/home/your-cpanel-username/opt/cpanel/ea-nodejs18/bin” does not exist.)
  ✗ /opt/alt/alt-nodejs22/root/usr/bin/node (The directory “/home/your-cpanel-username/opt/alt/alt-nodejs22/root/usr/bin” does not exist.)
  ✗ /opt/alt/alt-nodejs20/root/usr/bin/node (The directory “/home/your-cpanel-username/opt/alt/alt-nodejs20/root/usr/bin” does not exist.)
  ✗ /opt/alt/alt-nodejs18/root/usr/bin/node (The directory “/home/your-cpanel-username/opt/alt/alt-nodejs18/root/usr/bin” does not exist.)
  ✗ /usr/local/bin/node (The directory “/home/your-cpanel-username/usr/local/bin” does not exist.)
  ✗ /usr/bin/node (The directory “/home/your-cpanel-username/usr/bin” does not exist.)
  ✗ /opt/cpanel/ea-nodejs/bin/node (The directory “/home/your-cpanel-username/opt/cpanel/ea-nodejs/bin” does not exist.)
  ✗ /usr/local/cpanel/3rdparty/bin/node (The directory “/home/your-cpanel-username/usr/local/cpanel/3rdparty/bin” does not exist.)
```

## Cron probe
```
{
  "messages": null,
  "status": 0,
  "metadata": {},
  "errors": [
    "Failed to load module \u201cCron\u201d: The system failed to load the module \u201cCpanel::API::Cron\u201d because of an error: Can't locate Cpanel/API/Cron.pm in @INC (you may need to install the Cpanel::API::Cron module) (@INC contains: /usr/local/cpanel /usr/local/cpanel/3rdparty/perl/536/cpanel-lib/x86_64-linux /usr/local/cpanel/3rdparty/perl/536/cpanel-lib /usr/local/cpanel/3rdparty/perl/536/lib/x86_64-linux /usr/loca
```

## Looking for Apache included confs in user home
```
  etc
  logs
  lscache
  mail
  prompt-health-checker
  public_ftp
  public_html
  ssl
  tmp
  tools.zulqurnainj.com
```

## Trying each node path in .htaccess and probing response
```

--- Trying PassengerNodejs=/opt/cpanel/ea-nodejs22/bin/node ---
  write .htaccess ok=True
  enable ok=True
  result: curl_err=28 (28=timeout, 7=connrefused)

--- Trying PassengerNodejs=/opt/cpanel/ea-nodejs20/bin/node ---
  write .htaccess ok=True
  enable ok=True
  result: curl_err=28 (28=timeout, 7=connrefused)

--- Trying PassengerNodejs=/opt/cpanel/ea-nodejs18/bin/node ---
  write .htaccess ok=True
  enable ok=True
  result: curl_err=28 (28=timeout, 7=connrefused)

--- Trying PassengerNodejs=/opt/alt/alt-nodejs22/root/usr/bin/node ---
  write .htaccess ok=True
  enable ok=True
  result: code=200 first=HTTP/1.1 200 OK
  *** GOT RESPONSE from /opt/alt/alt-nodejs22/root/usr/bin/node! ***
  body:
HTTP/1.1 200 OK
keep-alive: timeout=5, max=100
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
x-nextjs-cache: HIT
x-nextjs-prerender: 1
x-nextjs-stale-time: 300
x-powered-by: Next.js
cache-control: s-maxage=31536000
etag: "8dxyryzic89vd"
content-type: text/html; charset=utf-8
transfer-encoding: chunked
date: Thu, 14 May 2026 23:59:49 GMT
server: LiteSpeed
x-turbo-charged-by: LiteSpeed

<!DOCTYPE html><html lang="en" class="h-full"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="/_next/static/chunks/0pylwlm~b6.t3.css" data-precedence="next"/><link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/0k7kk1kees4pi.js"/><script src="/_next/

  ✓ WORKING node binary: /opt/alt/alt-nodejs22/root/usr/bin/node
  Final check (20s wait): code=200 first=HTTP/1.1 200 OK
```

## Final external check
```
http://tools.zulqurnainj.com/text-to-leads → 200
https://tools.zulqurnainj.com/text-to-leads → 200
```