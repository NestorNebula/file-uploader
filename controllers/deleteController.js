const prisma = require('../models/queries');
const cloudinary = require('../modules/cloudinary');

const postDelete = async (req, res) => {
  const folder = await prisma.getFolderById(+req.body.id);
  if (!folder || req.user.id !== folder.userId) {
    return res.redirect('/user');
  }
  const files = folder.Files.map((file) =>
    file.url.split('/').pop().split('.').shift()
  );
  cloudinary.api.delete_resources(files);
  await prisma.deleteFolder(+req.body.id);
  res.redirect('/user');
};

module.exports = postDelete;
