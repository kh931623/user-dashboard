const passwordConfirmation = (value, {req}) => {
  if (value !== req.body.password) {
    console.log('not !');
    throw new Error('Password Confirmation must match password');
  }

  return true;
};

module.exports = {
  passwordConfirmation,
};
