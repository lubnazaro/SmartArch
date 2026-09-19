# Smart Arch

Architecture and interior design studio site for **[smartarch.net](https://www.smartarch.net)** — Smart Home + Interior Design, with a Google-secured admin panel for projects, media, About, Contact, and FAQ.

## Features

- Public site in **English** (default), **Arabic**, and **Hebrew** (RTL-ready)
- Sections: **Smart Home**, **Interior Design**, About, Contact, FAQ
- Project galleries with **photo/video uploads** and **Instagram links**
- Admin CMS at `/admin` — Google sign-in for `zarofiras@gmail.com` and `lubnazaro@gmail.com` only
- SQLite database (Prisma) for all content
- Beige, content-first visual design with motion

## Quick start

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://127.0.0.1:3847](http://127.0.0.1:3847).

## Google admin login

1. Create OAuth 2.0 credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Authorized redirect URI: `http://127.0.0.1:3847/api/auth/callback/google` (and your production URL)
3. Put values in `.env`:

```env
AUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
AUTH_URL="http://127.0.0.1:3847"
DATABASE_URL="file:./dev.db"
```

4. Visit `/admin/login` and sign in with Firas or Lubna’s Google account

## Logo

Upload the Smart Arch logo in **Admin → Site content**. Export your PDF logo to PNG or SVG first, then upload. Until then, a wordmark is used.

## Contact (seeded)

- WhatsApp / phone: `0595701747`
- Email: `smartarchitectureps@gmail.com`
- Instagram: [@smartarch.group](https://www.instagram.com/smartarch.group/)
- Address: Bethlehem / Jerusalem

## Stack

Next.js · TypeScript · Tailwind · Prisma (SQLite) · Auth.js (Google) · Framer Motion
