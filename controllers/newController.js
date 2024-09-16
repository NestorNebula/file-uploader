const { body } = require('express-validator');
const prisma = require('../models/queries');

const validateFolder = [body('fname').trim().blacklist('<>')];

const getNew = async (req, res) => {
  const folders = await prisma.getAllFolders();
  res.render('new', { folders: folders });
};

const postNew = [
  validateFolder,
  async (req, res) => {
    if (req.body.action_type === 'cfolder') {
      await prisma.createFolder({ name: req.body.fname, user: req.user });
      return res.redirect('/');
    }
    res.redirect('/');
  },
];

module.exports = { getNew, postNew };
