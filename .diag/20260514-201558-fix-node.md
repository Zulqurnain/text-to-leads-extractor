# Doctor v4 — 2026-05-14T20:15:14.467752Z mode=fix-node
- commit: 353d89be6dbe7d9d1afac3afbb908ec06067ee22
- run: https://github.com/Zulqurnain/text-to-leads-extractor/actions/runs/25883190673

## Searching for node binaries
```
--- ~/nodevenv ---
  ~/nodevenv: list failed

--- /opt/cpanel ea-nodejs ---
```

## cPanel NodeJS UAPI module
```
--- NodeJS/list_available_versions ---
{
  "data": null,
  "errors": [
    "Failed to load module \u201cNodeJS\u201d: The system failed to load the module \u201cCpanel::API::NodeJS\u201d because of an error: Can't locate Cpanel/API/NodeJS.pm in @INC (you may need to install the Cpanel::API::NodeJS module) (@INC contains: /usr/local/cpanel /usr/local/cpanel/3rdparty/perl/536/cpanel-lib/x86_64-linux /usr/local/cpanel/3rdparty/perl/536/cpanel-lib /usr/local/cpanel/3rdparty/perl/536/lib/x86_64-linux /usr/local/cpanel/3rdparty/perl/536/lib /opt/cpanel/perl5/536/site_lib/x86_64-linux /opt/cpanel/perl5/536/site_lib) at (eval 5) line 1.\nB
--- CloudLinuxNodeJS/list_versions ---
{
  "metadata": {},
  "messages": null,
  "status": 0,
  "warnings": null,
  "errors": [
    "Failed to load module \u201cCloudLinuxNodeJS\u201d: The system failed to load the module \u201cCpanel::API::CloudLinuxNodeJS\u201d because of an error: Can't locate Cpanel/API/CloudLinuxNodeJS.pm in @INC (you may need to install the Cpanel::API::CloudLinuxNodeJS module) (@INC contains: /usr/local/cpanel /usr/local/cpanel/3rdparty/perl/536/cpanel-lib/x86_64-linux /usr/local/cpanel/3rdparty/perl/536/cpanel-lib /usr/local/cpanel/3rdparty/perl/536/lib/x86_64-linux /usr/local/cpanel/3rdparty/perl/536/lib /
--- PassengerApps/list_supported_app_types ---
{
  "warnings": null,
  "data": null,
  "errors": [
    "The system could not find the function \u201clist_supported_app_types\u201d in the module \u201cPassengerApps\u201d."
  ],
  "metadata": {},
  "status": 0,
  "messages": null
}
```

## Probe: which nodevenv dirs exist for ANY domain
```
```

## Current .htaccess
```
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerEnabled On
PassengerBaseURI /
PassengerNodejs /home/your-cpanel-username/nodevenv/tools.zulqurnainj.com/22/bin/node
PassengerAppRoot /home/your-cpanel-username/tools.zulqurnainj.com
PassengerAppType node
PassengerStartupFile startup.js
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END

```

## Apply fix-node
```
NO NODE FOUND — cannot fix
```

## Final external check
```
http://tools.zulqurnainj.com/text-to-leads: Command '['curl', '-sk', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '20', 'http://tools.zulqurnainj.com/text-to-leads']' returned non-zero exit status 28.
https://tools.zulqurnainj.com/text-to-leads: Command '['curl', '-sk', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '20', 'https://tools.zulqurnainj.com/text-to-leads']' returned non-zero exit status 28.
```