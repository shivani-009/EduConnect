# EduConnect API

Express + MongoDB backend for the EduConnect tutor marketplace. Runs locally
with a normal `node`/`nodemon` process, and deploys to Vercel as a
serverless function (see `api/index.js` and `vercel.json`).

## Local development

```bash
cp .env.example .env    # set MONGO_URI and JWT_SECRET
npm install
npm run seed             # sample tutors
npm run dev               # http://localhost:5050
```

## Deploying to Vercel

### 1. Set up MongoDB Atlas (Vercel can't reach a local database)

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, add `0.0.0.0/0` ("Allow access from anywhere") —
   Vercel's serverless functions don't have a fixed IP, so you can't
   whitelist a single address.
3. Under **Database Access**, create a user with a password.
4. Get your connection string (Atlas → Connect → Drivers) — it looks like
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/educonnect`.

### 2. Deploy the backend

```bash
npm install -g vercel   # if you don't have it
cd educonnect-backend
vercel
```

Follow the prompts (link/create a project). Then set your environment
variables — either via the Vercel dashboard (Project → Settings →
Environment Variables) or the CLI:

```bash
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add CLIENT_ORIGIN
```

`CLIENT_ORIGIN` should be your deployed frontend's URL (you'll get this in
the next step — you can add/update it after deploying the frontend too).

Deploy to production:
```bash
vercel --prod
```

You'll get a URL like `https://educonnect-backend.vercel.app`. Test it:
`https://educonnect-backend.vercel.app/api/health` should return
`{"status":"ok",...}`.

### 3. Seed production data (optional)

Run the seed script locally but pointed at your Atlas database — temporarily
set `MONGO_URI` in your local `.env` to the Atlas connection string, then:
```bash
npm run seed
```
Switch your local `.env` back to your local MongoDB URI afterward if you
still want to develop locally.

## Why the project has both `src/server.js` and `api/index.js`

- `src/server.js` — used by `npm run dev`/`npm start` locally. Calls
  `app.listen()` like a normal Node server.
- `api/index.js` — used only by Vercel. Serverless functions can't run a
  long-lived `app.listen()` process, so this file exports a request handler
  instead, and `vercel.json` routes every request to it.
- `src/app.js` — the actual Express app (routes, middleware) shared by both
  entry points, so there's no duplicated logic.

## API Reference

See the route files in `src/routes/` — each is a small, self-explanatory
CRUD set. Key one: `GET /api/tutors?lat=&lng=&radiusMiles=...` for real
geospatial "near me" search via MongoDB's `$near`.
