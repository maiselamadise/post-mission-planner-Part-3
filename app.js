require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

const app = express();

// Render sits behind a proxy; needed for secure cookies and correct OAuth callback URLs
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-only-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Post-Mission Planner API. Docs at /api-docs',
    loggedIn: Boolean(req.user)
  });
});

app.use('/', require('./routes'));

// Malformed JSON body -> 400
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

// Unknown route -> 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

module.exports = app;
