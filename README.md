# Post-Mission Planner API

CSE 341 final project. CRUD for four collections: `spiritualGoals`, `careerGoals`, `financialGoals`, and `educationGoals`, GitHub OAuth, Jest tests, and Swagger docs at `/api-docs`.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and set `MONGODB_URI` (`.env` is git-ignored; never commit it)
3. `npm run dev` then open http://localhost:3000/api-docs

## Deploy on Render
- New Web Service from this GitHub repo
- Build command: `npm install` | Start command: `npm start`
- Environment variables: `MONGODB_URI`, `SESSION_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `NODE_ENV=production`
- Do NOT set `GITHUB_CALLBACK_URL` to a localhost address on Render. Leave it unset (the app uses Render's public URL automatically) or set it to the `https://` Render URL
- In Atlas > Network Access, allow `0.0.0.0/0` so Render can connect
- Docs: `https://<your-service>.onrender.com/api-docs`

## Status codes
GET 200 · POST 201 · PUT 204 · DELETE 200 · bad input/id 400 · missing record 404 · server error 500

## Testing in Swagger
- POST needs a `userId` (24-character hex string). The example value in the docs works, e.g. `665f1c2e8b3a4d0012345678`.
- PUT accepts any subset of fields; `userId` and `_id` cannot be changed, and an empty body returns 400.
- Quick error checks: GET `/spiritual-goals/abc` returns 400; a valid but unused id returns 404.

## OAuth (GitHub)
1. GitHub > Settings > Developer settings > OAuth Apps > New. Callback URL: `https://<your-service>.onrender.com/auth/github/callback` (make a second GitHub OAuth app for localhost; the production app's callback must be the Render URL, never localhost).
2. Set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SESSION_SECRET`, and `NODE_ENV=production` on Render. `GITHUB_CALLBACK_URL` is optional there.
3. Visit `/auth/login` in the browser, then use Swagger "Try it out" (the session cookie is sent automatically). `/auth/logout` ends the session.
- Protected: POST, PUT, DELETE on all four collections (401 when logged out). GET stays public.

## Tests
`npm test` (or `npm run test:verbose` to list every test name, useful for the demo video) runs Jest + Supertest with mocked models (no database needed): GET, GET by id, 400/404/500 paths, and 401 on protected routes.
