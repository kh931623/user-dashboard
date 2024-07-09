const express = require('express');
const router = express.Router();

const sessionService = require('../services/session');
const apiAuthMiddleware = require('../middlewares/api-auth');
const prismaClient = require('../prisma');

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
