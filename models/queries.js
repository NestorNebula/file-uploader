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

module.exports = { createUser };
