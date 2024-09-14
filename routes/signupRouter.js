const { Router } = require('express');
const signupRouter = Router();
const signupController = require('../controllers/signupController');

signupRouter.get('/', signupController.getSignup);
signupRouter.post('/', signupController.postSignup);

module.exports = signupRouter;
