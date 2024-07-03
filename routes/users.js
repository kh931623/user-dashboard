var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res) => {
  const {
    email,
    password
  } = req.body

  res.json({
    email,
    password
  })
})

router.post('/signup', (req, res) => {
  const {
    email,
    password,
    passwordConfirm,
  } = req.body

  res.cookie('test', 'hehehe')
  res.json({
    email,
    password,
    passwordConfirm,
  })
})

module.exports = router;
