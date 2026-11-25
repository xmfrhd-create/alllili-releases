# Working rules for this repository

## Owner preference: ship automatically
The owner wants every app or service built here to go live without manual steps.
After finishing a change, Claude should, without asking again:
1. Commit and push to the working branch.
2. Open a pull request into `main` and merge it (squash) once the build passes.
3. Make sure the Vercel project deploys from `main` (production) and report the live URL.

## Projects
* `dancingtonight/`: Dancing Tonight, Next.js site on Vercel (Root Directory `dancingtonight`).
  * Build check: `cd dancingtonight && npm install && npm run build`
  * Env vars on Vercel: `DATABASE_URL` (Postgres, for /admin analytics), `ADMIN_PASSWORD`, optional `NEXT_PUBLIC_SITE_URL`.
  * Every data entry in `data/` must carry a real source link. Never invent events.
