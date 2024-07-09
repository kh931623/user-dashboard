const {
  body,
} = require('express-validator');

const {
  passwordConfirmation,
} = require('./customs');

const loginValidator = [
  body('email').notEmpty().isEmail().trim(),
  body('password').notEmpty().trim(),
];

const signupValidator = [
  body('email').notEmpty().trim(),
  body('password').notEmpty().trim(),
  body('passwordConfirm').notEmpty().custom(passwordConfirmation).trim(),
];

module.exports = {
  loginValidator,
  signupValidator,
};
