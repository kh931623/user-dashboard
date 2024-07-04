var express = require('express');
var router = express.Router();

const verificationService = require('../services/verification')
const userService = require('../services/user')

const authMiddleware = require('../middlewares/auth')

/* GET home page. */
router.get('/', authMiddleware, function (req, res, next) {
  res.redirect('/profile')
});

router.get('/profile', authMiddleware, (req, res) => {
  res.render('profile', {
    title: 'Profile'
  })
})

router.get('/dashboard', authMiddleware, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard'
  })
})

router.get('/login', (req, res) => {
  res.render('login', { title: 'Sign In' });
})

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' })
})

router.get('/verify', async (req, res) => {
  const { token } = req.query

  try {
    const email = await verificationService.parseToken(token)

    await userService.verifyUser(email)

    res.redirect('/')
  } catch (error) {
    res.status(400).send('Invalid verification link!')
  }
})

module.exports = router;
