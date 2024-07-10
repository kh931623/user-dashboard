const {
  body,
} = require('express-validator');

const {
  passwordConfirmation,
  newPasswordCannotMatchOldPassword,
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

const resetNameValidator = [
  body('name').notEmpty().trim().escape(),
];

const resetPasswordValidator = [
  body('oldPassword').notEmpty().trim(),
  body('password').notEmpty().custom(newPasswordCannotMatchOldPassword).trim(),
  body('passwordConfirm').notEmpty().custom(passwordConfirmation).trim(),
];

module.exports = {
  loginValidator,
  signupValidator,
  resetNameValidator,
  resetPasswordValidator,
};
