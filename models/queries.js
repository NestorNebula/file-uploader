const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createUser = async (user) => {
  await prisma.user.create({
    data: {
      username: user.username,
      email: user.email,
      password: user.password,
    },
  });
};

const checkExistingUser = async (username, email) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  return user;
};

const getUser = async (user) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ username: user }, { email: user }] },
  });
  return user;
};

module.exports = { createUser, checkExistingUser, getUser };
