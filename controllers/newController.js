const { body } = require('express-validator');
const prisma = require('../models/queries');
const cloudinary = require('../modules/cloudinary');

const validateFolder = [body('fname').trim().blacklist('<>')];

const setOptions = (id) => {
  return { public_id: id, overwrite: true };
};

const getNew = async (req, res) => {
  const folders = await prisma.getAllFolders();
  res.render('new', { folders: folders });
};

const postNew = [
  validateFolder,
  async (req, res) => {
    if (req.body.action_type === 'cfolder') {
      await prisma.createFolder({ name: req.body.fname, user: req.user });
    } else if (req.body.action_type === 'cfile') {
      const id = req.file.originalname.split('.')[0] + req.user.id;
      const options = setOptions(id);
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataUri = 'data:' + req.file.mimetype + ';base64,' + b64;
      const result = await cloudinary.uploader.upload(dataUri, options);
      await prisma.createFile({
        url: result.secure_url,
        name: req.body.fname,
        size: req.file.size,
        folder: +req.body.folder,
      });
    }
    res.redirect('/');
  },
];

module.exports = { getNew, postNew };
