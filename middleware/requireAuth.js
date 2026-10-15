// Blocks the request with 401 unless the user has logged in through OAuth
module.exports = function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Authentication required. Log in at /auth/login' });
};
