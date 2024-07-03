var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Sign In' });
  res.redirect('/login')
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Sign In' });
})

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' })
})

module.exports = router;
