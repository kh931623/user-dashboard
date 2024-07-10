const passwordConfirmation = (value, {req}) => {
  if (value !== req.body.password) {
    throw new Error('Password Confirmation must match password');
  }

  return true;
};

const newPasswordCannotMatchOldPassword = (value, {req}) => {
  if (value === req.body.oldPassword) {
    throw new Error('New Password can not be identical as old password');
  }

  return true;
};

module.exports = {
  passwordConfirmation,
  newPasswordCannotMatchOldPassword,
};
