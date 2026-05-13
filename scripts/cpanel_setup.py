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

# 4. List PassengerApps functions
print("\n=== PassengerApps module functions ===")
r_funcs = curl(f"https://{host}:2083/json-api/cpanel?cpanel_jsonapi_module=PassengerApps&cpanel_jsonapi_func=listfuncs&cpanel_jsonapi_apiversion=2")
print("PassengerApps funcs:", r_funcs[:600])

# 5. Try PassengerApps/register_application with correct params
print("\n=== Trying PassengerApps/register_application ===")
import urllib.parse
app_params = urllib.parse.urlencode({
    "name": "tools",
    "path": f"/home/{user}/tools.zulqurnainj.com",
    "domain": "tools.zulqurnainj.com",
    "base_uri": "/",
    "app_type": "node",
    "startup_file": "startup.js",
    "node_version": "22",
})
r = curl(f"{uapi}/PassengerApps/register_application?{app_params}")
print("register_application:", r[:500])
try:
    results['nodejs_create'] = json.loads(r)
except:
    results['nodejs_create'] = {'status': 0, 'raw': r[:200]}

r_versions = r_funcs[:300]
r_list = ""

print("\n=== Setup complete ===")
print(json.dumps(results, indent=2)[:800])

if token and repo:
    body = f"""## cPanel Server Setup Complete

**MySQL database:** `{db_name}`
**MySQL user:** `{db_user}`

**DB create:** `{results.get('db_create', {}).get('status', '?')}`
**User create:** `{results.get('user_create', {}).get('status', '?')}`
**Privileges:** `{results.get('privileges', {}).get('status', '?')}`
**Node.js App:** `{results.get('nodejs_create', {}).get('status', '?')}`

### Debug — Node.js API responses

**Available versions raw:** `{r_versions[:300]}`

**Existing apps raw:** `{r_list[:300]}`

**Create app raw:** `{r[:500]}`

### Next steps
1. Run the DB migration: paste `supabase/schema.sql` into phpMyAdmin on `{db_name}`
2. Push to master to trigger the deploy workflow
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
