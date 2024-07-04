var express = require('express');
var router = express.Router();

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

router.get('/login', (req, res) => {
  res.render('login', { title: 'Sign In' });
})

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' })
})

module.exports = router;
