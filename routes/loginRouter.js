const { Router } = require('express');
const loginRouter = Router();
const loginController = require('../controllers/loginController');
const passport = require('passport');

loginRouter.get('/', loginController.getLogin);
loginRouter.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/log-in',
  })
);

module.exports = loginRouter;
