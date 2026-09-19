# Go live — smartarch.net (Cloudflare)

**GitHub repo:** https://github.com/lubnazaro/SmartArch

The site needs a **persistent server** (database + photo/video uploads).  
Plain Cloudflare Pages alone is not enough for this admin CMS.

Recommended path: **Fly.io** (or Railway) for the app + **Cloudflare DNS** for the domain.

---

## 1) Push code to GitHub (if the repo is still empty)

```bash
git remote add github https://github.com/lubnazaro/SmartArch.git
git push -u github main
```

Or grant the agent a GitHub Personal Access Token (repo write) so it can push for you.

---

## 2) Deploy the app (Fly.io)

From your machine (or ask me after the GitHub repo exists):

```bash
# Install: https://fly.io/docs/hands-on/install-flyctl/
fly auth login
fly apps create smartarch-net
fly volumes create smartarch_data --region fra --size 3
fly secrets set AUTH_SECRET="$(openssl rand -base64 32)"
fly secrets set AUTH_URL="https://www.smartarch.net"
fly secrets set NEXTAUTH_URL="https://www.smartarch.net"
fly deploy
```

You will get a temporary URL like `https://smartarch-net.fly.dev` — confirm it works.

Alternative: **Railway** → New Project → Deploy from GitHub → add a volume on `/data` → set the same secrets.

---

## 3) Cloudflare DNS (your domain)

In [Cloudflare Dashboard](https://dash.cloudflare.com) → **smartarch.net** → **DNS** → **Records**:

| Type  | Name | Content                         | Proxy |
|-------|------|----------------------------------|-------|
| CNAME | `www` | `smartarch-net.fly.dev` (or your Railway domain) | Proxied (orange) |
| CNAME | `@`   | `smartarch-net.fly.dev` *(if Cloudflare allows CNAME flattening)* | Proxied |

If apex `@` CNAME is awkward, use Cloudflare **Redirect Rule**:  
`smartarch.net` → `https://www.smartarch.net` (301).

Also in Cloudflare:
- SSL/TLS mode: **Full (strict)**
- Always Use HTTPS: **On**

---

## 4) Production env checklist

```env
AUTH_SECRET=<long random>
AUTH_URL=https://www.smartarch.net
NEXTAUTH_URL=https://www.smartarch.net
DATABASE_URL=file:/data/smartarch.db
DATA_DIR=/data
```

---

## 5) First login after go-live

1. Open `https://www.smartarch.net/admin/login`
2. `zarofiras@gmail.com` or `lubnazaro@gmail.com`
3. Password: `BlueBirdf88!`
4. Change password immediately
5. Upload projects / FAQ

---

## Local production test

```bash
export AUTH_SECRET="$(openssl rand -base64 32)"
export AUTH_URL="http://127.0.0.1:3847"
docker compose up --build
```
