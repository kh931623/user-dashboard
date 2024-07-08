const validatePasswordConfirm = (password, passwordConfirm) => password === passwordConfirm;

const hidePasswordError = (passwordErrorElem) => {
  passwordErrorElem.querySelectorAll(`#${passwordErrorElem.id} > *`).forEach((node) => {
    node.style.display = 'none';
  });

  passwordErrorElem.style.display = 'none';
};

const showPasswordError = (errors, passwordErrorElem) => {
  if (!errors.length) return;

  passwordErrorElem.style.display = 'block';
  passwordErrorElem.querySelector('h3').style.display = 'block';

  errors.forEach((id) => {
    passwordErrorElem.querySelector(`#${id}`).style.display = 'block';
  });
};

const togglePasswordConfirmError = (valid, passwordConfirmErrorElem) => {
  if (!valid) passwordConfirmErrorElem.style.display = 'block';
  else passwordConfirmErrorElem.style.display = 'none';
};

const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('length');
  }

  if (!password.match(/[a-z]/g)) {
    errors.push('lowercase');
  }

  if (!password.match(/[A-Z]/g)) {
    errors.push('uppercase');
  }

  if (!password.match(/[0-9]/g)) {
    errors.push('digit');
  }

  if (!password.match(/[#?!@$%^&*-]/g)) {
    errors.push('special');
  }

  return errors;
};
