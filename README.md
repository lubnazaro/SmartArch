# Smart Arch

Architecture and interior design studio site for **[smartarch.net](https://www.smartarch.net)** — Smart Home + Interior Design, with a local email/password admin panel for projects, media, About, Contact, and FAQ.

## Features

- Public site in **English** (default), **Arabic**, and **Hebrew** (RTL-ready)
- Sections: **Smart Home**, **Interior Design**, About, Contact, FAQ
- Project galleries with **photo/video uploads** and **Instagram links**
- Admin CMS at `/admin` — local login for `zarofiras@gmail.com` and `lubnazaro@gmail.com`
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

## Admin login

1. Open [http://127.0.0.1:3847/admin/login](http://127.0.0.1:3847/admin/login)
2. Sign in with either admin email:
   - `zarofiras@gmail.com`
   - `lubnazaro@gmail.com`
3. Default password (first login only): `BlueBirdf88!`
4. You will be asked to **change the password** before accessing the admin tools

`.env` needs:

```env
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://127.0.0.1:3847"
DATABASE_URL="file:./dev.db"
```

## Logo

The Smart Arch PNG logo is included and shown in the site header. You can replace it anytime in **Admin → Site content**.

## Domain (Cloudflare)

You already own **smartarch.net**. When ready to go live:

1. Deploy the app (e.g. Cloudflare Pages, Vercel, or a VPS)
2. In Cloudflare DNS for `smartarch.net`, point `www` (and apex `@`) to that host
3. Set production `AUTH_URL=https://www.smartarch.net`

## Contact (seeded)

- WhatsApp / phone: `0595701747`
- Email: `smartarchitectureps@gmail.com`
- Instagram: [@smartarch.group](https://www.instagram.com/smartarch.group/)
- Address: Bethlehem / Jerusalem

## Stack

Next.js · TypeScript · Tailwind · Prisma (SQLite) · Auth.js (credentials) · Framer Motion
