#!/usr/bin/env python3
"""One-time server setup: create MySQL DB + user, create cPanel Node.js App."""
import os, json, subprocess, urllib.parse, urllib.request

host  = os.environ['CPANEL_HOST']
user  = os.environ['CPANEL_USER']
pw    = os.environ['CPANEL_PASS']
token = os.environ.get('GH_TOKEN', '')
repo  = os.environ.get('GH_REPO', '')

base    = f"https://{host}:2083/json-api/cpanel"
uapi    = f"https://{host}:2083/execute"
db_name = f"{user}_toolsdb"
db_user = f"{user}_toolsu"
db_pass = os.environ.get('DB_PASS', 'ChangeMe_strong_pass_123')
app_dir = f"tools.{host.replace('your-hosting-server.com', 'zulqurnainj.com')}"

def curl(url):
    return subprocess.check_output(
        ['curl', '-sk', '-u', f"{user}:{pw}", url], text=True, timeout=20
    )

results = {}

# 1. Create MySQL database
print("=== Creating MySQL database ===")
r = curl(f"{uapi}/Mysql/create_database?name={db_name}")
results['db_create'] = json.loads(r)
print(r[:200])

# 2. Create MySQL user
print("\n=== Creating MySQL user ===")
r = curl(f"{uapi}/Mysql/create_user?name={db_user}&password={urllib.parse.quote(db_pass, safe='')}")
results['user_create'] = json.loads(r)
print(r[:200])

# 3. Grant all privileges
print("\n=== Granting privileges ===")
r = curl(f"{uapi}/Mysql/set_privileges_on_database?user={db_user}&database={db_name}&privileges=ALL+PRIVILEGES")
results['privileges'] = json.loads(r)
print(r[:200])

# 4. List available Node.js versions
print("\n=== Available Node.js versions ===")
r_versions = curl(f"{uapi}/NodeJS/get_available_node_versions")
print(r_versions[:500])
try:
    versions_data = json.loads(r_versions)
    available = [v.get('version','?') for v in versions_data.get('data', [])]
    print("Available versions:", available)
    node_ver = "22" if "22" in str(available) else (available[-1] if available else "20")
except Exception as e:
    print("Could not parse versions:", e)
    node_ver = "20"

# 5. List existing apps (in case already created)
print("\n=== Existing Node.js Apps ===")
r_list = curl(f"{uapi}/NodeJS/list_applications")
print(r_list[:500])

# 6. Create Node.js App
print(f"\n=== Creating Node.js App (node_version={node_ver}) ===")
r = curl(
    f"{uapi}/NodeJS/create_application"
    f"?app_name=tools.zulqurnainj.com"
    f"&app_root=tools.zulqurnainj.com"
    f"&startup_file=server.js"
    f"&node_version={node_ver}"
    f"&app_env=production"
)
results['nodejs_create'] = json.loads(r)
print("FULL RESPONSE:", r[:1000])

print("\n=== Setup complete ===")
print(json.dumps(results, indent=2)[:800])

if token and repo:
    body = f"""## cPanel Server Setup Complete

**MySQL database:** `{db_name}`
**MySQL user:** `{db_user}`
**DB password:** Set in env var `DB_PASS` during workflow run

**DB create:** `{results.get('db_create', {}).get('status', '?')}`
**User create:** `{results.get('user_create', {}).get('status', '?')}`
**Privileges:** `{results.get('privileges', {}).get('status', '?')}`
**Node.js App:** `{results.get('nodejs_create', {}).get('status', '?')}`

### Next steps
1. Set all env vars in cPanel Node.js App panel (see `.env.example`)
2. Set `DB_PASS={db_pass}` (or change it) in the Node.js App env vars
3. Run the DB migration: copy `schema.sql` content into phpMyAdmin on `{db_name}`
4. Push to master to trigger the deploy workflow
"""
    payload = json.dumps({'title': '[setup] cPanel server setup complete', 'body': body}).encode()
    req = urllib.request.Request(
        f'https://api.github.com/repos/{repo}/issues',
        data=payload,
        headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        d = json.loads(resp.read())
        print(f"\nIssue #{d['number']}: setup report")
