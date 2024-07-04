const bcrypt = require('bcrypt');

const prismaClient = require('../prisma');

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

  if (!user) throw new Error('Wrong Credentials')

  const valid = await verifyPassword(password, user.password)

  if (!valid) throw new Error('Wrong Credentials')

  return user
}

const updateName = async (user, name) => {
  const res = await prismaClient.user.update({
    where: {
      email: user.email
    },
    data: {
      name
    }
  })

  return res
}

const resetPassword = async (email, oldPassword, password, passwordConfirm) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email,
    }
  })

  const valid = await verifyPassword(oldPassword, user.password)

  if (!valid) throw new Error('Wrong Old password')

  const hashedPassword = await hashPassword(password)

  const updatedUser = await prismaClient.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword
    }
  })

  return updatedUser
}

module.exports = {
  register,
  login,
  updateName,
  resetPassword,
}