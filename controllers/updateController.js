const prisma = require('../models/queries');

const postUpdate = async (req, res) => {
  const folder = await prisma.getFolderById(+req.body.id);
  if (!folder || req.user.id !== folder.userId) {
    return res.redirect('/user');
  }
  if (req.body.action === 'ask') {
    return res.render('update', { folder });
  } else if (req.body.action === 'send') {
    await prisma.updateFolder(+req.body.id, { name: req.body.name });
  }
  res.redirect('/user');
};

module.exports = postUpdate;
