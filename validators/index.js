const {
  body,
} = require('express-validator');

const loginValidator = [
  body('email').notEmpty().isEmail(),
  body('password').notEmpty(),
];

module.exports = {
  loginValidator,
};
