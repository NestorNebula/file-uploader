const { body } = require('express-validator');
const prisma = require('../models/queries');

const validateFolder = [body('fname').trim().blacklist('<>')];

const getNew = (req, res) => {
  res.render('new');
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
