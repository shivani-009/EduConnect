# EduConnect — Frontend

React + Vite + Tailwind frontend for the EduConnect tutor marketplace.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Start the backend first (see `../educonnect-backend`) — this app has no
offline fallback.

## Deploying to Vercel

1. Deploy the backend first (see its README) and note its live URL, e.g.
   `https://educonnect-backend.vercel.app`.
2. From this folder:
   ```bash
   npm install -g vercel   # if you don't have it
   vercel
   ```
   Vercel auto-detects this as a Vite project — accept the defaults
   (build command `npm run build`, output directory `dist`).
3. Set the environment variable so the deployed frontend calls your deployed
   backend instead of localhost:
   ```bash
   vercel env add VITE_API_URL
   ```
   Enter `https://educonnect-backend.vercel.app/api` (your actual backend
   URL + `/api`) when prompted.
4. Deploy to production:
   ```bash
   vercel --prod
   ```
5. **Go back to the backend's Vercel project** and update its
   `CLIENT_ORIGIN` environment variable to this frontend's live URL (e.g.
   `https://educonnect.vercel.app`), then redeploy the backend
   (`vercel --prod` again in that folder) so CORS allows requests from your
   live site.

Your live link (the one to put on LinkedIn) is the frontend's URL — e.g.
`https://educonnect.vercel.app`.

## What's wired to the real backend

Auth, tutor search (including real geospatial "near me" search), tutor
profiles, bookings, saved tutors, messages, and notifications. See
`src/services/` — each file is a thin wrapper around one backend resource.

"Continue with Google/Apple" is intentionally not wired to real OAuth — it
shows an honest "not available in this demo" message instead of faking a
login.

## Troubleshooting

- **Network error after deploying**: double-check `VITE_API_URL` matches
  your backend's actual Vercel URL (with `/api` at the end), and that you
  redeployed after setting it — env var changes need a redeploy to take
  effect on Vercel.
- **CORS error in the browser console**: the backend's `CLIENT_ORIGIN`
  doesn't match your frontend's live URL. Update it and redeploy the
  backend.
