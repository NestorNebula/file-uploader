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
    include: { Folders: { include: { Files: true, ShareLink: true } } },
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
  const folder = await prisma.folder.findUnique({
    where: { id },
    include: {
      Files: true,
      ShareLink: true,
    },
  });
  return folder;
};

const getAllFolders = async () => {
  const folders = await prisma.folder.findMany({
    include: {
      Files: true,
      ShareLink: true,
    },
  });
  return folders;
};

const updateFolder = async (id, folder) => {
  await prisma.folder.update({
    where: { id },
    data: { name: folder.name },
  });
};

const deleteFolder = async (id) => {
  await prisma.shareLink.deleteMany({
    where: { folderId: id },
  });
  await prisma.file.deleteMany({
    where: { folderId: id },
  });
  await prisma.folder.delete({
    where: { id },
  });
};

// File queries

const createFile = async (file) => {
  await prisma.file.create({
    data: {
      url: file.url,
      name: file.name,
      size: file.size,
      folder: {
        connect: { id: file.folder },
      },
    },
  });
};

const getFile = async (id) => {
  const file = await prisma.file.findUnique({ where: { id } });
  return file;
};

const deleteFile = async (id) => {
  await prisma.file.delete({
    where: { id },
  });
};

// ShareLink queries

const createLink = async (exDate, folderId) => {
  await prisma.shareLink.create({
    data: {
      expire: exDate,
      folder: {
        connect: { id: folderId },
      },
    },
  });
};

const getLinkByFolderId = async (folderId) => {
  const link = await prisma.shareLink.findUnique({
    where: { folderId },
  });
  return link;
};

const getLinkByLink = async (link) => {
  const shareLink = await prisma.shareLink.findFirst({
    where: { link },
  });
  return shareLink;
};

const updateLink = async (exDate, folderId) => {
  await prisma.shareLink.update({
    where: { folderId },
    data: {
      expire: exDate,
    },
  });
};

module.exports = {
  createUser,
  checkExistingUser,
  getUserByUsermail,
  getUserById,
  createFolder,
  getFolderById,
  getAllFolders,
  updateFolder,
  deleteFolder,
  createFile,
  getFile,
  deleteFile,
  createLink,
  getLinkByFolderId,
  getLinkByLink,
  updateLink,
};
