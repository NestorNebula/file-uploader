const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// User queries

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

const getUserByUsermail = async (username) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ username }, { email: username }] },
  });
  return user;
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { Folders: { include: { Files: true } } },
  });
  return user;
};

// Folder queries

const createFolder = async (folder) => {
  await prisma.folder.create({
    data: {
      name: folder.name,
      user: {
        connect: { id: folder.user.id },
      },
    },
  });
};

const getFolderById = async (id) => {
  const folder = await prisma.folder.findUnique({ where: { id } });
  return folder;
};

module.exports = {
  createUser,
  checkExistingUser,
  getUserByUsermail,
  getUserById,
  createFolder,
  getFolderById,
};
