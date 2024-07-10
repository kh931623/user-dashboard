const express = require('express');
const router = express.Router();

const sessionService = require('../services/session');
const apiAuthMiddleware = require('../middlewares/api-auth');
const prismaClient = require('../prisma');

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: user@example.com
 *         created_at:
 *           type: string
 *           example: 2024-07-09T18:04:53.943Z
 *         last_session_at:
 *           type: string
 *           example: 2024-07-09T18:04:53.943Z
 *         login_count:
 *           type: number
 *           example: 0
 */

/**
 * @openapi
 * /dashboards:
 *   get:
 *     summary: Get dashboard data
 *     responses:
 *       200:
 *         description: Successfully return dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DashboardUser'
 *                 NumberOfActiveUsersToday:
 *                   type: number
 *                   example: 1
 *                 averageUsersWithin7Days:
 *                   type: number
 *                   example: 0.14
 */
router.get('/', apiAuthMiddleware, async (req, res) => {
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
