const express = require('express');
const router = express.Router();

const userService = require('../services/user');
const sessionService = require('../services/session');
const verificationService = require('../services/verification');
const maskUser = require('../utils/mask-user');
const prismaClient = require('../prisma');
const {
  loginValidator,
  signupValidator,
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

router.patch('/', apiAuthMiddleware, async (req, res) => {
  try {
    const user = await userService.updateName(req.session.user, req.body.name);

    req.session.user = user;
    res.json(maskUser(user));
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

router.post('/reset-password', apiAuthMiddleware, async (req, res) => {
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

router.get('/dashboard', apiAuthMiddleware, async (req, res) => {
  try {
    const sessions = await sessionService.getAllSession(req);
    const activeUsersToday = sessionService.getTodayActiveUsers(sessions);
    const averageUsersWithin7Days =
      sessionService.getAverageUsersWithin7Days(sessions);
    const users = await prismaClient.user.findMany({
      select: {
        email: true,
        login_count: true,
        last_session_at: true,
        created_at: true,
      },
    });

    res.json({
      users,
      NumberOfActiveUsersToday: activeUsersToday.length,
      averageUsersWithin7Days,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
