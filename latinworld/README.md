# Latinworld

Where to dance Latin (salsa, bachata, kizomba, zouk), in any city, any week.

* Product spec: [docs/PRD.md](docs/PRD.md)
* Data lives in `data/` as TypeScript files. Every entry must have a source link.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build check
```

## Deploy on Vercel

1. vercel.com → Add New → Project → import this GitHub repository.
2. Set **Root Directory** to `latinworld`.
3. Optional environment variable: `NEXT_PUBLIC_SITE_URL` = your final domain (used in sitemap and SEO tags).
4. Admin analytics: in the project, Storage → Create Database → Neon (Postgres) → connect. This sets `DATABASE_URL`.
5. Settings → Environment Variables → add `ADMIN_PASSWORD` (a long random password). Then open `/admin`.
6. Deploy. Every push to the branch redeploys automatically.

## Adding a city

1. Add the city to `data/cities.ts` (slug, name, country, IANA timezone).
2. Add socials, schools and festivals to `data/listings.ts`, each with a `source`.
3. City pages with fewer than 3 listings are hidden from Google (`noindex`) until they have real content.
