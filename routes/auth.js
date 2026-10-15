const router = require('express').Router();
const passport = require('passport');

const oauthConfigured = () => Boolean(passport._strategy && passport._strategy('github'));

router.get('/login', (req, res, next) => {
  if (!oauthConfigured()) return res.status(503).json({ message: 'OAuth is not configured on this server' });
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

router.get('/github/callback', (req, res, next) => {
  if (!oauthConfigured()) return res.status(503).json({ message: 'OAuth is not configured on this server' });
  passport.authenticate('github', { failureRedirect: '/auth/failure' })(req, res, next);
}, (req, res) => res.redirect('/api-docs'));

router.get('/failure', (req, res) => res.status(401).json({ message: 'GitHub login failed' }));

router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not logged in' });
  res.status(200).json(req.user);
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out' });
    });
  });
});

module.exports = router;
