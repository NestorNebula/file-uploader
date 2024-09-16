const prisma = require('../models/queries');

const postDelete = async (req, res) => {
  const folder = await prisma.getFolderById(+req.body.id);
  if (!folder || req.user.id !== folder.userId) {
    return res.redirect('/user');
  }
  await prisma.deleteFolder(+req.body.id);
  res.redirect('/user');
};

module.exports = postDelete;
