var express = require('express');
var router = express.Router();
const R = require('ramda')

const userService = require('../services/user')
const maskUser = require('../utils/mask-user')

const apiAuthMiddleware = require('../middlewares/api-auth')

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

router.get('/profile', apiAuthMiddleware, async (req, res) => {
  res.json(maskUser(req.session.user))
})

router.post('/', apiAuthMiddleware, async (req, res) => {
  const user = await userService.updateName(req.session.user, req.body.name)

  req.session.user = user
  res.json(maskUser(user))
})

module.exports = router;
