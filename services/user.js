const bcrypt = require('bcrypt');

const prismaClient = require('../prisma')

const hashPassword = (password) => bcrypt.hash(password, 10)
const verifyPassword = bcrypt.compare

const register = async (email, password, passwordConfirm) => {
  const hashedPassword = await hashPassword(password)

  return await prismaClient.user.create({
    data: {
      email,
      password: hashedPassword
    }
  })
}

const login = async (email, password) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email,
    }
  })

  if (!user) return null

  const valid = await verifyPassword(password, user.password)

  if (!valid) return null

  return user
}

module.exports = {
  register,
  login,
}