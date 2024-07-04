const R = require('ramda')

const ONE_DAY_MS = 24 * 60 * 60 * 1000

const getAllSession = (req) => new Promise((resolve, reject) => {
  req.sessionStore.all((err, data) => {
    if (err) reject(err)
    resolve(data)
  })
})

const isActiveSessionWithIn = (period) => (session) => {
  const expires = R.path(['cookie', 'expires'], session)
  const d = new Date(expires)

  return Date.now() - d.getTime() <= period
}

const isTodaySession = isActiveSessionWithIn(ONE_DAY_MS)
const isActiveWithin7Days = isActiveSessionWithIn(ONE_DAY_MS * 7)

const getTodayActiveUsers = (sessions) => {
  return R.pipe(
    R.filter(isTodaySession),
    R.map(R.prop('user')),
    R.uniqBy(R.prop('id')),
  )(sessions)
}

const getAverageUsersWithin7Days = (sessions) => {
  return R.pipe(
    R.filter(isActiveWithin7Days),
    R.map(R.prop('user')),
    R.uniqBy(R.prop('id')),
    R.length,
    R.divide(R.__, 7)
  )(sessions)
}

module.exports = {
  getAllSession,
  getTodayActiveUsers,
  getAverageUsersWithin7Days,
}
