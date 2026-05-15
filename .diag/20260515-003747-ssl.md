# SSL Provision — 2026-05-15T00:35:57.567468Z
- run: https://github.com/Zulqurnain/text-to-leads-extractor/actions/runs/25893662736

## Current cert BEFORE
```
subject=CN = *.web-hosting.com
issuer=C = GB, O = Sectigo Limited, CN = Sectigo Public Server Authentication CA DV R36
notBefore=Mar 12 00:00:00 2026 GMT
notAfter=Apr  5 23:59:59 2027 GMT

```

## SSL/installed_hosts
```
  domain=None issuer.organizationName=None fqdns=['autodiscover.zulqurnainj.com', 'cpanel.zulqurnainj.com', 'cpcalendars.zulqurnainj.com', 'cpcontacts.zulqurnainj.com', 'mail.zulqurnainj.com', 'webdisk.zulqurnainj.com', 'webmail.zulqurnainj.com', 'www.zulqurnainj.com', 'zulqurnainj.com']
```

## Disable Passenger for ACME challenge
```
disable ok=True
minimal .htaccess ok=True
mkdir acme-challenge: 0
```

## LetsEncrypt/issue
```
ok=False
{
  "errors": [
    "Failed to load module \u201cLetsEncrypt\u201d: The system failed to load the module \u201cCpanel::API::LetsEncrypt\u201d because of an error: Can't locate Cpanel/API/LetsEncrypt.pm in @INC (you may need to install the Cpanel::API::LetsEncrypt module) (@INC contains: /usr/local/cpanel /usr/local/cpanel/3rdparty/perl/536/cpanel-lib/x86_64-linux /usr/local/cpanel/3rdparty/perl/536/cpanel-lib /usr/local/cpanel/3rdparty/perl/536/lib/x86_64-linux /usr/local/cpanel/3rdparty/perl/536/lib /opt/cpanel/perl5/536/site_lib/x86_64-linux /opt/cpanel/perl5/536/site_lib) at (eval 5) line 1.\nBEGIN failed--compilation aborted at (eval 5) line 1.\n"
  ],
  "data": null,
  "warnings": null,
  "messages": null,
  "status": 0,
  "metadata": {}
}
```

## SSL/start_autossl_check
```
{
  "warnings": null,
  "errors": [
    "You do not have the feature \u201cautossl\u201d."
  ],
  "data": null,
  "metadata": {},
  "messages": null,
  "status": 0
}
```
Waiting 60s for AutoSSL...

## Restore Passenger config
```
restore .htaccess ok=True
enable ok=True
```

## Current cert AFTER
```
subject=CN = *.web-hosting.com
issuer=C = GB, O = Sectigo Limited, CN = Sectigo Public Server Authentication CA DV R36
notBefore=Mar 12 00:00:00 2026 GMT
notAfter=Apr  5 23:59:59 2027 GMT

```

## Final checks
```
  http (verify): code=200
  http (insecure): code=200
  https (verify): err=60 (60=cert invalid)
  https (insecure): code=200
```