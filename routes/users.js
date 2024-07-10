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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: user@example.com
 *         name:
 *           type: string
 *           example: Peter Lee
 *         created_at:
 *           type: string
 *           example: 2024-07-09T18:04:53.943Z
 *         updated_at:
 *           type: string
 *           example: 2024-07-09T18:04:53.943Z
 *         last_session_at:
 *           type: string
 *           example: 2024-07-09T18:04:53.943Z
 *         verified:
 *           type: boolean
 *           example: false
 *         login_count:
 *           type: number
 *           example: 0
 */

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Log in to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: user@example.com
 *                 required: true
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: secretPassword123
 *                 required: true
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 */
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

/**
 * @openapi
 * /users/signup:
 *   post:
 *     summary: Sign up a account in the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: user@example.com
 *                 required: true
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: secretPassword123
 *                 required: true
 *               passwordConfirm:
 *                 type: string
 *                 description:
 *                   User's password confirmation, must match password
 *                 example: secretPassword123
 *                 required: true
 *     responses:
 *       200:
 *         description: Successful Signup
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 */
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

/**
 * @openapi
 * /users/profile:
 *   get:
 *     summary: get user info for current authenticated user
 *     responses:
 *       200:
 *         description: Successfully return the user's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 */
router.get('/profile', apiAuthMiddleware, async (req, res) => {
  res.json(maskUser(req.session.user));
});

/**
 * @openapi
 * /users:
 *   patch:
 *     summary: Change name for current authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *                 example: Peter Lee
 *                 required: true
 *     responses:
 *       200:
 *         description: Successfully changed user's name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 */
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

/**
 * @openapi
 * /users/reset-password:
 *   post:
 *     summary: Let authenticated user to reset their password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: User's old password
 *                 example: oldPassword
 *                 required: true
 *               password:
 *                 type: string
 *                 description: User's new password
 *                 example: secretPassword123
 *                 required: true
 *               passwordConfirm:
 *                 type: string
 *                 description:
 *                   User's new password confirmation, must match password
 *                 example: secretPassword123
 *                 required: true
 *     responses:
 *       200:
 *         description: Successfully reset password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 */
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

/**
 * @openapi
 * /users/logout:
 *   post:
 *     summary: Log out current authenticated user
 *     responses:
 *       200:
 *         description: Successfully log out!
 */
router.post('/logout', apiAuthMiddleware, async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).send(err.message);
    }

    res.clearCookie('connect.sid');
    res.status(200).send('Successfully log out!');
  });
});

module.exports = router;
