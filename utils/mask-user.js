const R = require('ramda')

const maskUser = R.omit([
  'id',
  'password',
])

module.exports = maskUser