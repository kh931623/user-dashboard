const express = require('express');
const router = express.Router();

const userService = require('../services/user');
const verificationService = require('../services/verification');
const maskUser = require('../utils/mask-user');
const {
  loginValidator,
  signupValidator,
  resetNameValidator,
  resetPasswordValidator,
} = require('../validators');

const apiAuthMiddleware = require('../middlewares/api-auth');
const validationCheckMiddleware = require('../middlewares/validation-check');

router.post(
    '/login',
    loginValidator,
    validationCheckMiddleware,
    async (req, res) => {
      const {
        email,
        password,
      } = req.body;

      try {
        const user = await userService.login(email, password);
        req.session.user = user;
        res.json(maskUser(user));
      } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
      }
    });

router.post(
    '/signup',
    signupValidator,
    validationCheckMiddleware,
    async (req, res) => {
      const {
        email,
        password,
        passwordConfirm,
      } = req.body;

      try {
        const user = await userService.register(
            email,
            password,
            passwordConfirm,
        );
        await verificationService.sendVerificationEmail(user.email);
        req.session.user = user;
        res.json(maskUser(user));
      } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
      }
    });

router.get('/profile', apiAuthMiddleware, async (req, res) => {
  res.json(maskUser(req.session.user));
});

router.patch(
    '/',
    apiAuthMiddleware,
    resetNameValidator,
    validationCheckMiddleware,
    async (req, res) => {
      try {
        const user = await userService
            .updateName(req.session.user, req.body.name);

        req.session.user = user;
        res.json(maskUser(user));
      } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
      }
    });

router.post(
    '/reset-password',
    apiAuthMiddleware,
    resetPasswordValidator,
    validationCheckMiddleware,
    async (req, res) => {
      const {
        oldPassword,
        password,
        passwordConfirm,
      } = req.body;

      try {
        const user = await userService.resetPassword(
            req.session.user.email,
            oldPassword,
            password,
            passwordConfirm,
        );

        req.session.user = user;
        res.json(maskUser(user));
      } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
      }
    });

router.post('/logout', apiAuthMiddleware, async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).send(err.message);
    }

    res.clearCookie('connect.sid');
    res.status(200).end();
  });
});

module.exports = router;
