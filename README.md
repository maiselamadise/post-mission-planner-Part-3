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

(Maisela Manhla Madise)I completed this project on my own, so I designed and built every part of it. The main contributions were:

1. API and database layer. I built the Express and MongoDB (Mongoose) API with full CRUD (GET, GetAll, POST, PUT, DELETE) for four collections: spiritualGoals, careerGoals, financialGoals and educationGoals. I wrote a reusable CRUD controller factory (crudController.js) and the four Mongoose models, and I return the correct status codes (200, 201, 204, 400, 401, 404, 500).

2. Data validation and error handling. I added schema-level validation (required fields, enums, min/max ranges, length limits) to every model and enabled runValidators on PUT. I wrapped every handler in try/catch, wrote a shared error handler that returns 400 or 500, and wrote validateObjectId middleware to reject malformed ids.

3. GitHub OAuth authentication. I implemented GitHub OAuth with Passport and express-session, and wrote the requireAuth middleware that protects all POST, PUT and DELETE routes. I also wrote the callback URL logic so the deployed app never redirects to localhost.

4. Swagger documentation. I wrote swagger.json for all endpoints, including the cookie-auth security scheme, request and response schemas and example values, and served it at /api-docs.

5. Unit testing. I wrote Jest and Supertest tests with mocked models for the GET and GetAll routes of all four collections, covering success, empty, 400, 404 and 500 cases, plus 401 checks on the protected routes.

6. Deployment and security. I deployed the app to Render with MongoDB Atlas, kept all secrets in environment variables, and excluded .env from GitHub via .gitignore.