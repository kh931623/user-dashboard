const express = require('express');
const router = express.Router();

const verificationService = require('../services/verification');
const userService = require('../services/user');

const authMiddleware = require('../middlewares/auth');

/* GET home page. */
router.get('/', authMiddleware, (req, res, next) => {
  res.redirect('/profile');
});

router.get('/profile', authMiddleware, (req, res) => {
  res.render('profile', {
    title: 'Profile',
    verified: req.session.user.verified,
    from_google: req.session.user.from_google,
  });
});

router.get('/dashboard', authMiddleware, (req, res) => {
  if (req.session.user.verified) {
    res.render('dashboard', {
      title: 'Dashboard',
    });
  } else {
    res.redirect('/');
  }
});

router.get('/login', (req, res) => {
  res.render('login', {title: 'Sign In'});
});

router.get('/signup', (req, res) => {
  res.render('signup', {title: 'Sign Up'});
});

router.get('/verify', async (req, res) => {
  const {token} = req.query;

  try {
    const email = await verificationService.parseToken(token);

    const updatedUser = await userService.verifyUser(email);

    req.session.user = updatedUser;
    res.redirect('/');
  } catch (error) {
    res.status(400).send('Invalid verification link!');
  }
});

module.exports = router;
