const bcrypt = require('bcrypt');
const R = require('ramda');

const prismaClient = require('../prisma');

const hashPassword = (password) => bcrypt.hash(password, 10);
const verifyPassword = bcrypt.compare;

const register = async (email, password, passwordConfirm) => {
  const hashedPassword = await hashPassword(password);

  return await prismaClient.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
};

const login = async (email, password) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new Error('Wrong Credentials');

  const valid = await verifyPassword(password, user.password);

  if (!valid) throw new Error('Wrong Credentials');

  await prismaClient.user.update({
    where: {
      email,
    },
    data: {
      login_count: user.login_count + 1,
      last_session_at: new Date(),
    },
  });

  return user;
};

const updateName = async (user, name) => {
  const res = await prismaClient.user.update({
    where: {
      email: user.email,
    },
    data: {
      name,
    },
  });

  return res;
};

const resetPassword = async (email, oldPassword, password, passwordConfirm) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email,
    },
  });

  const valid = await verifyPassword(oldPassword, user.password);

  if (!valid) throw new Error('Wrong Old password');

  const hashedPassword = await hashPassword(password);

  const updatedUser = await prismaClient.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return updatedUser;
};

const verifyUser = (email) => {
  return prismaClient.user.update({
    where: {
      email,
    },
    data: {
      verified: true,
    },
  });
};

const getEmailFromProfile = R.path([
  'emails',
  0,
  'value',
]);

const googleLogin = async (googleProfile) => {
  const email = getEmailFromProfile(googleProfile);

  const user = await prismaClient.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    await prismaClient.user.update({
      where: {
        email,
      },
      data: {
        login_count: user.login_count + 1,
      },
    });

    return user;
  }

  const createdUser = await prismaClient.user.create({
    data: {
      email,
      name: googleProfile.displayName,
      password: 'N/A',
      verified: true,
      from_google: true,
    },
  });

  return createdUser;
};

module.exports = {
  register,
  login,
  updateName,
  resetPassword,
  verifyUser,
  googleLogin,
};
