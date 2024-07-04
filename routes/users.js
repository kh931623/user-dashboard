var express = require('express');
var router = express.Router();
const R = require('ramda')

const userService = require('../services/user')
const maskUser = require('../utils/mask-user')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async (req, res) => {
  const {
    email,
    password
  } = req.body

  const user = await userService.login(email, password)

  if (user) {
    req.session.user = user
    res.json(maskUser(user))
  } else {
    res.status(400).json({
      message: "Failed to login"
    })
  }
})

router.post('/signup', async (req, res) => {
  const {
    email,
    password,
    passwordConfirm,
  } = req.body

  const user = await userService.register(email, password, passwordConfirm)

  if (user) {
    req.session.user = user
    res.json(maskUser(user))
  } else {
    res.status(400).json({
      message: "Failed to sign up"
    })
  }
})

module.exports = router;
