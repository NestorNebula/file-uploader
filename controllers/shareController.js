const prisma = require('../models/queries');
const download = require('../modules/download');

const getShare = async (req, res) => {
  const link = await prisma.getLinkByLink(req.params.link);
  if (!link || link.expire < new Date()) {
    return res.redirect('/');
  }
  const folder = await prisma.getFolderById(link.folderId);
  const user = await prisma.getUserById(folder.userId);
  res.render('share', { folder, user });
};

const postShare = async (req, res) => {
  const date = new Date();
  req.body.exDate === 'hours'
    ? date.setDate(date.getDate() + 1)
    : req.body.exDate === 'days'
    ? date.setDate(date.getDate() + 10)
    : date.setMonth(date.getMonth() + 1);
  const existingLink = await prisma.getLinkByFolderId(+req.body.folder);
  if (existingLink) {
    await prisma.updateLink(date, +req.body.folder);
  }
  await prisma.createLink(date, +req.body.folder);
  res.redirect('/user');
};

const downloadShare = async (req, res) => {
  const file = await prisma.getFile(+req.params.file);
  download(file.url, res);
};

module.exports = { getShare, postShare, downloadShare };
