#!/usr/bin/env python3
"""One-time server setup: create MySQL DB + user, create/register cPanel Passenger app."""
import os, json, subprocess, urllib.parse, urllib.request

host  = os.environ['CPANEL_HOST']
user  = os.environ['CPANEL_USER']
pw    = os.environ['CPANEL_PASS']
token = os.environ.get('GH_TOKEN', '')
repo  = os.environ.get('GH_REPO', '')

uapi    = f"https://{host}:2083/execute"
db_name = f"{user}_toolsdb"
db_user = f"{user}_toolsu"
db_pass = os.environ.get('DB_PASS', 'ChangeMe_strong_pass_123')

def curl(url):
    return subprocess.check_output(
        ['curl', '-sk', '-u', f"{user}:{pw}", url], text=True, timeout=20
    )

results = {}

# 1. Create MySQL database (ok if already exists)
print("=== Creating MySQL database ===")
r = curl(f"{uapi}/Mysql/create_database?name={db_name}")
results['db_create'] = json.loads(r).get('status', 0)
print(r[:200])

# 2. Create MySQL user (ok if already exists)
print("\n=== Creating MySQL user ===")
r = curl(f"{uapi}/Mysql/create_user?name={db_user}&password={urllib.parse.quote(db_pass, safe='')}")
results['user_create'] = json.loads(r).get('status', 0)
print(r[:200])

# 3. Grant all privileges
print("\n=== Granting privileges ===")
r = curl(f"{uapi}/Mysql/set_privileges_on_database?user={db_user}&database={db_name}&privileges=ALL+PRIVILEGES")
results['privileges'] = json.loads(r).get('status', 0)
print(r[:200])

# 4. Register Passenger/Node.js App (ok if already exists — will error with duplicate)
print("\n=== Registering Passenger Node.js App ===")
app_params = urllib.parse.urlencode({
    "name": "tools",
    "path": f"/home/{user}/tools.zulqurnainj.com",
    "domain": "tools.zulqurnainj.com",
    "base_uri": "/",
    "startup_file": "startup.js",
    "app_type": "node",
    "node_version": "22",
    "deployment_mode": "production",
})
r = curl(f"{uapi}/PassengerApps/register_application?{app_params}")
reg = json.loads(r)
results['nodejs_create'] = reg.get('status', 0)
print(r[:500])

if reg.get('status') == 0 and 'already' in str(reg.get('errors', '')).lower():
    print("App already exists — skipping (this is OK)")
    results['nodejs_create'] = 1  # treat as success

print("\n=== Setup complete ===")
print(json.dumps(results, indent=2))

if token and repo:
    body = f"""## cPanel Server Setup Complete

**MySQL database:** `{db_name}`
**MySQL user:** `{db_user}`
**DB password:** stored in GitHub Secret `DB_PASS`

| Step | Status |
|------|--------|
| DB create | `{results.get('db_create')}` (0=already exists, 1=created) |
| User create | `{results.get('user_create')}` (0=already exists, 1=created) |
| Privileges | `{results.get('privileges')}` |
| Node.js App | `{results.get('nodejs_create')}` |

### Next step — run the DB migration
1. Log into [cPanel phpMyAdmin](https://{host}:2083) → `{db_name}`
2. Go to SQL tab and paste the contents of `supabase/schema.sql`
3. Click "Go"

### Next step — configure llama.cpp
Set the `LLAMA_API_URL` secret in GitHub repo settings to your llama.cpp server URL.

### Deployment
Push to master to trigger the deploy workflow — files will be FTP'd automatically.
"""
    payload = json.dumps({'title': '[setup] cPanel server setup complete', 'body': body}).encode()
    req = urllib.request.Request(
        f'https://api.github.com/repos/{repo}/issues',
        data=payload,
        headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        d = json.loads(resp.read())
        print(f"\nIssue #{d['number']}: setup report posted")
