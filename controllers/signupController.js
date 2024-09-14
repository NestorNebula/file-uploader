const { validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const prisma = require('../models/queries');
const passport = require('passport');

const errLength = (field, min, max) => {
  return min === 0
    ? `The ${field} should have a maximum length of ${max} characters.`
    : `The ${field} length should be between ${min} and ${max} characters.`;
};

const validateUser = [
  body('username')
    .trim()
    .blacklist('<>')
    .isLength({ min: 2, max: 30 })
    .withMessage(() => errLength('username', 2, 30)),
  body('email')
    .trim()
    .blacklist('<>')
    .isLength({ max: 50 })
    .withMessage(() => errLength('email', 0, 50))
    .isEmail()
    .withMessage('Email is not valid.'),
  body('password')
    .trim()
    .blacklist('<>')
    .custom((password, { req }) => {
      if (password !== req.body.confirm) {
        throw new Error("The passwords don't match.");
      }
      return password;
    }),
];

const getSignup = (req, res) => {
  res.render('sign-up');
};

const postSignup = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('sign-up', { errors: errors.array() });
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return res.render('sign-up', {
          errors: [{ msg: 'Error when storing the password' }],
        });
      }
      await prisma.createUser({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
    });
    res.redirect('/log-in');
  },
];

module.exports = { getSignup, postSignup };
