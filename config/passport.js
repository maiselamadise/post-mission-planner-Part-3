const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

// Keep only what we need in the session cookie
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const CALLBACK_PATH = '/auth/github/callback';
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL, RENDER_EXTERNAL_URL, NODE_ENV } = process.env;

// Picks the callback URL so the deployed site never redirects to localhost.
// - Production on Render: use the service's public URL, which Render provides automatically.
// - An explicit GITHUB_CALLBACK_URL is used only if it is not a localhost address in production.
// - Local development: falls back to GITHUB_CALLBACK_URL or http://localhost:3000.
function resolveCallbackUrl() {
  const isProd = NODE_ENV === 'production';
  const explicit = GITHUB_CALLBACK_URL && GITHUB_CALLBACK_URL.trim();
  const explicitIsLocal = explicit && /localhost|127\.0\.0\.1/.test(explicit);

  if (explicit && !(isProd && explicitIsLocal)) return explicit;
  if (RENDER_EXTERNAL_URL) return RENDER_EXTERNAL_URL.replace(/\/$/, '') + CALLBACK_PATH;
  if (isProd) return CALLBACK_PATH; // relative; resolved from the request host (trust proxy is on)
  return `http://localhost:${process.env.PORT || 3000}${CALLBACK_PATH}`;
}

if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
  const callbackURL = resolveCallbackUrl();
  console.log(`GitHub OAuth callback URL: ${callbackURL}`);
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL,
        proxy: true
      },
      (accessToken, refreshToken, profile, done) =>
        done(null, { id: profile.id, username: profile.username, displayName: profile.displayName })
    )
  );
} else {
  console.warn('GitHub OAuth env vars not set: /auth/login will return 503.');
}

module.exports = passport;
