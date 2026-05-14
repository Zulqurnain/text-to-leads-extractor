# tools-doctor diagnostic
- timestamp: Thu May 14 19:57:23 UTC 2026
- mode: fix-passenger
- commit: b611932b7b09ffbe613e3ec6519585281612d199
- run: https://github.com/Zulqurnain/text-to-leads-extractor/actions/runs/25882311864

## External probes (from runner)

```
--- DNS ---
68.65.120.156   STREAM tools.zulqurnainj.com
68.65.120.156   DGRAM  
68.65.120.156   RAW    
--- HTTP /text-to-leads ---
--- HTTPS /text-to-leads ---
--- TLS cert ---
subject=CN = *.web-hosting.com
issuer=C = GB, O = Sectigo Limited, CN = Sectigo Public Server Authentication CA DV R36
notBefore=Mar 12 00:00:00 2026 GMT
notAfter=Apr  5 23:59:59 2027 GMT
X509v3 Subject Alternative Name: 
    DNS:*.web-hosting.com, DNS:web-hosting.com
```

## Secrets status

```
SSH_HOST: set
SSH_USER: set
SSH_PASS: set
```
## sshpass install
```
Get:22 https://dl.google.com/linux/chrome-stable/deb stable/main amd64 Packages [1205 B]
Fetched 7843 kB in 1s (6578 kB/s)
Reading package lists...
Reading state information...
sshpass is already the newest version (1.09-1).
0 upgraded, 0 newly installed, 0 to remove and 4 not upgraded.
/usr/bin/sshpass
```
## SSH connection test
```
Warning: Permanently added '[your-hosting-server.com]:YOUR_SFTP_PORT' (ED25519) to the list of known hosts.
Shell access is not enabled on your account!
If you need shell access please contact support.
```
## Remote diagnostic
```
Warning: Permanently added '[your-hosting-server.com]:YOUR_SFTP_PORT' (ED25519) to the list of known hosts.
Shell access is not enabled on your account!
If you need shell access please contact support.
```
## Applying fix-passenger
```
Warning: Permanently added '[your-hosting-server.com]:YOUR_SFTP_PORT' (ED25519) to the list of known hosts.
Shell access is not enabled on your account!
If you need shell access please contact support.
```
## Final preview (truncated to 5000 chars)
