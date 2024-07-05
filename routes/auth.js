var express = require('express');
var router = express.Router();

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const userService = require('../services/user')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.HOST}/auth/google/callback`
},
  async (accessToken, refreshToken, profile, cb) => {
    cb(null, await userService.googleLogin(profile))
  }
));

router.get('/google', passport.authenticate('google', {
  scope: [
    'email',
    'profile'
  ]
}));

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: false,
}), (req, res) => {
  // Successful authentication, redirect home.
  req.session.user = req.user
  res.redirect('/');
});

module.exports = router